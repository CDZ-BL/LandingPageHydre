/**
 * POST /api/auth/reset-password
 *
 * Validates a password-reset token and updates the user's password.
 * Token must be unused and not expired (10-min TTL from issuance).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { ResetPasswordSchema } from '@/lib/validations/auth';

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

    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;
    const supabase = getServerSupabase();

    // ── 3. LOOKUP TOKEN ───────────────────────────────────────
    const { data: resetToken, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('id, user_id, expires_at, used_at')
        .eq('token', token)
        .single();

    if (tokenError || !resetToken) {
        return NextResponse.json(
            { error: 'Lien invalide ou expiré.' },
            { status: 400 }
        );
    }

    // ── 4. VALIDATE TOKEN STATE ───────────────────────────────
    if (resetToken.used_at) {
        return NextResponse.json(
            { error: 'Ce lien a déjà été utilisé.' },
            { status: 400 }
        );
    }

    if (new Date(resetToken.expires_at) < new Date()) {
        return NextResponse.json(
            { error: 'Lien expiré. Veuillez faire une nouvelle demande.' },
            { status: 400 }
        );
    }

    // ── 5. UPDATE PASSWORD ────────────────────────────────────
    const { error: updateError } = await supabase.auth.admin.updateUserById(
        resetToken.user_id,
        { password: newPassword }
    );

    if (updateError) {
        console.error('[HYDRE] reset-password update error:', updateError);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du mot de passe.' },
            { status: 500 }
        );
    }

    // ── 6. INVALIDATE TOKEN ───────────────────────────────────
    await supabase
        .from('password_reset_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', resetToken.id);

    return NextResponse.json({ success: true }, { status: 200 });
}
