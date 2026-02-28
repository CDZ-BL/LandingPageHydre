/**
 * Auth Signup — POST /api/auth/signup
 * V2.0.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit → Zod Validation → Supabase Auth (USER_CREATE) →
 * Generate Verification Code → Verify Code Insert → Resend Email
 *
 * Anti-enumeration: Already-registered users return 200 OK silently.
 * Email verification is required before account activation.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { SignupSchema } from '@/lib/validations/auth';
import { VerificationEmail } from '@/emails/VerificationEmail';

/** Supabase auth error for user already registered */
const AUTH_USER_ALREADY_EXISTS = 'user_already_exists';

export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT ───────────────────────────────────────
    const rateLimitResponse = await applyRateLimit(request);
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
            { error: 'Validation error', details: parsed.error.issues },
            { status: 400 }
        );
    }

    const { email, password, referralCode } = parsed.data;

    // ── 3. CREATE AUTH USER (NO AUTO-CONFIRM) ────────────────
    const supabase = getServerSupabase();
    const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
        });

    if (authError) {
        // Anti-enumeration: user already exists → silent 200
        if (
            authError.message.includes(AUTH_USER_ALREADY_EXISTS) ||
            authError.message.includes('already been registered')
        ) {
            return NextResponse.json({ success: true }, { status: 200 });
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
            // Non-blocking: metadata update failure should not break signup
            console.warn('[HYDRE] Failed to store referral code:', metaError);
        }
    }

    // ── 5. GENERATE 6-DIGIT VERIFICATION CODE ────────────────
    const verificationCode = String(
        Math.floor(100000 + Math.random() * 900000)
    );
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // ── 6. INSERT VERIFICATION CODE ──────────────────────────
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
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'HYDRE — Vérifiez votre email',
            react: VerificationEmail({
                email,
                code: verificationCode,
            }),
        });
    } catch (emailError) {
        // Non-blocking: email failure should not break the signup flow
        console.error('[HYDRE] Verification email failed:', emailError);
    }

    return NextResponse.json(
        { success: true, message: 'Verification code sent' },
        { status: 201 }
    );
}
