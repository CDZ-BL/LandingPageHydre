/**
 * POST /api/auth/forgot-password
 *
 * Generates a secure password-reset token (32-byte hex, 10-min TTL)
 * and sends it via email as a link to /reset-password?token=…
 *
 * Anti-enumeration: always returns 200, regardless of whether the
 * email is registered. The client cannot tell if an account exists.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { ForgotPasswordSchema } from '@/lib/validations/auth';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import { render } from '@react-email/components';
import { randomBytes } from 'crypto';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT ────────────────────────────────────────
    const rateLimitResponse = await applyRateLimit(request, 'auth');
    if (rateLimitResponse) return rateLimitResponse;

    // ── 2. VALIDATE INPUT ────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { email } = parsed.data;
    const supabase = getServerSupabase();

    // ── 3. LOOKUP USER (SERVICE_ROLE) ─────────────────────────
    // Anti-enumeration: even on failure we return 200 below
    const { data: userList } = await supabase.auth.admin.listUsers();
    const user = userList?.users.find((u) => u.email === email);

    if (!user) {
        // Silent 200 — do not reveal account existence
        return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── 4. INVALIDATE EXISTING UNUSED TOKENS ─────────────────
    await supabase
        .from('password_reset_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('used_at', null);

    // ── 5. GENERATE TOKEN ─────────────────────────────────────
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
        .from('password_reset_tokens')
        .insert({ user_id: user.id, token, expires_at: expiresAt });

    if (insertError) {
        console.error('[HYDRE] forgot-password insert error:', insertError);
        // Silent 200 — do not leak DB errors
        return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── 6. SEND EMAIL ─────────────────────────────────────────
    try {
        const resetUrl = `${SITE_URL}/reset-password?token=${token}`;
        const resend = getResend();
        const html = await render(PasswordResetEmail({ email, resetUrl }));
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'SMART NUTRITION — Réinitialisation de mot de passe',
            html,
        });
    } catch (emailError) {
        console.error('[HYDRE] Password reset email failed:', emailError);
        // Silent 200 — do not leak email errors
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
