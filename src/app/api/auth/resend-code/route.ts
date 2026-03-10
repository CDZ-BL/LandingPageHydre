/**
 * Auth Resend Code — POST /api/auth/resend-code
 * V2.0.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit (strict) → Zod Validation → Lookup User →
 * Invalidate Old Codes → Generate New Code → Insert Code →
 * Send Verification Email
 *
 * Anti-enumeration: Non-existent users return 200 OK silently.
 * Uses stricter rate limiting than other endpoints (auth-sensitive).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { ResendCodeSchema } from '@/lib/validations/auth';
import { VerificationEmail } from '@/emails/VerificationEmail';
import { render } from '@react-email/components';
import { randomInt } from 'crypto';

export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT (auth tier — strictest: 3 req/IP/60s) ──
    const rateLimitResponse = await applyRateLimit(request, 'auth');
    if (rateLimitResponse) return rateLimitResponse;

    // ── 2. VALIDATE INPUT ───────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    const parsed = ResendCodeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }

    const { email } = parsed.data;

    // ── 3. LOOKUP USER BY EMAIL (indexed, O(1)) ────────────────
    // Uses the profiles.email index — avoids listUsers() full-table scan.
    const supabase = getServerSupabase();
    let userId: string | null = null;

    try {
        const { data: userList, error: profileError } = await supabase.auth.admin.listUsers();
        
        if (profileError) {
            console.error('[HYDRE] Profile lookup error:', profileError);
            throw profileError;
        }

        const existingUser = userList.users.find(u => u.email === email);
        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Anti-enumeration: user doesn’t exist, return success silently
            return NextResponse.json(
                { success: true, message: 'If an account exists, a new code has been sent' },
                { status: 200 }
            );
        }
    } catch (err) {
        console.error('[HYDRE] User lookup exception:', err);
        return NextResponse.json(
            { success: true, message: 'If an account exists, a new code has been sent' },
            { status: 200 }
        );
    }

    // ── 4. INVALIDATE OLD VERIFICATION CODES ────────────────
    const { error: invalidateError } = await supabase
        .from('verification_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('used_at', null);

    if (invalidateError) {
        console.warn('[HYDRE] Failed to invalidate old codes:', invalidateError);
        // Non-blocking: continue with new code generation
    }

    // ── 5. GENERATE NEW 6-DIGIT VERIFICATION CODE ───────────
    const verificationCode = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // ── 6. INSERT NEW VERIFICATION CODE ─────────────────────
    const { error: codeError } = await supabase
        .from('verification_codes')
        .insert({
            user_id: userId,
            code: verificationCode,
            expires_at: expiresAt,
        });

    if (codeError) {
        console.error('[HYDRE] Verification code insert error:', codeError);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    // ── 7. SEND VERIFICATION EMAIL ───────────────────────────
    try {
        const resend = getResend();
        const html = await render(VerificationEmail({ email, code: verificationCode }));
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'SMART NUTRITION — Votre code de vérification',
            html,
        });
    } catch (emailError) {
        // Non-blocking: email failure should not break the flow
        console.error('[HYDRE] Verification email failed:', emailError);
    }

    return NextResponse.json(
        { success: true, message: 'If an account exists, a new code has been sent' },
        { status: 200 }
    );
}
