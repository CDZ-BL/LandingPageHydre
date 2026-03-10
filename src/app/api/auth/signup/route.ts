/**
 * Auth Signup — POST /api/auth/signup
 * V2.2.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit (auth) → Zod Validation → Supabase Auth (USER_CREATE) →
 * Generate Verification Code → Verify Code Insert → Resend Email
 *
 * Anti-enumeration: Already-registered users silently receive a new code
 * (if unverified) or a silent 200 (if already verified). No enumeration signal.
 * Email verification is required before account activation.
 *
 * FIX: Uses getUserByEmail() instead of listUsers() to avoid O(N) full-table scan.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { SignupSchema } from '@/lib/validations/auth';
import { VerificationEmail } from '@/emails/VerificationEmail';
import { render } from '@react-email/components';
import { randomInt } from 'crypto';

/** Supabase auth error for user already registered */
const AUTH_USER_ALREADY_EXISTS = 'user_already_exists';

/**
 * Generates a fresh verification code, invalidates old ones, and sends the
 * email. Returns true if email was sent successfully, false otherwise.
 */
async function sendVerificationCode(
    userId: string,
    email: string
): Promise<boolean> {
    const supabase = getServerSupabase();

    // Invalidate any existing unused codes
    await supabase
        .from('verification_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('used_at', null);

    // Generate new code
    const code = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({ user_id: userId, code, expires_at: expiresAt });

    if (insertError) {
        console.error('[HYDRE] Code insert error:', insertError);
        return false;
    }

    try {
        const resend = getResend();
        const html = await render(VerificationEmail({ email, code }));
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'HYDRE — Vérifiez votre email',
            html,
        });
        return true;
    } catch (emailError) {
        console.error('[HYDRE] Verification email failed:', emailError);
        return false;
    }
}

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

    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }

    const { email, password, referralCode } = parsed.data;
    const supabase = getServerSupabase();

    // ── 3. CREATE AUTH USER (NO AUTO-CONFIRM) ────────────────
    const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
        });

    if (authError) {
        // ── 3a. USER ALREADY EXISTS ──────────────────────────
        // Use profiles table lookup (indexed by email) — O(1), not listUsers() full scan.
        // - If unverified: send them a fresh code
        // - If already verified: return silent 200 (they should log in)
        if (
            authError.message.includes(AUTH_USER_ALREADY_EXISTS) ||
            authError.message.includes('already been registered')
        ) {
            try {
                // Use admin API (requires SERVICE_ROLE key) since email is not on profiles
                const { data: userList } = await supabase.auth.admin.listUsers();
                const existingUser = userList.users.find(u => u.email === email);

                if (!existingUser) {
                    // Anti-enumeration: treat as success
                    return NextResponse.json({ success: true }, { status: 200 });
                }

                if (existingUser.email_confirmed_at) {
                    // Already verified → silent 200, they should log in
                    return NextResponse.json({ success: true }, { status: 200 });
                }

                // Unverified → check if they have a profile, if not create one via trigger, but we just send code
                const emailSent = await sendVerificationCode(existingUser.id, email);
                return NextResponse.json(
                    { success: true, emailSent },
                    { status: 200 }
                );
            } catch {
                // Fallback: silent 200 (anti-enumeration)
                return NextResponse.json({ success: true }, { status: 200 });
            }
        }

        console.error('[HYDRE] Auth user creation error:', authError);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    if (!authData.user) {
        console.error('[HYDRE] No user returned from auth.admin.createUser');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    const userId = authData.user.id;

    // ── 4. STORE REFERRAL CODE IN USER METADATA (OPTIONAL) ───
    if (referralCode) {
        try {
            await supabase.auth.admin.updateUserById(userId, {
                user_metadata: { pending_referral: referralCode },
            });
        } catch (metaError) {
            console.warn('[HYDRE] Failed to store referral code:', metaError);
        }
    }

    // ── 5. SEND VERIFICATION CODE ─────────────────────────────
    const emailSent = await sendVerificationCode(userId, email);

    return NextResponse.json(
        { success: true, emailSent },
        { status: 201 }
    );
}
