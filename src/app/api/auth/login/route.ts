/**
 * Auth Login — POST /api/auth/login
 * V2.2.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit (auth) → Zod Validation → Supabase Auth (signInWithPassword, anon key) →
 * Email Verification Check (service role) → Session Return
 *
 * IMPORTANT: signInWithPassword MUST use the anon key client.
 * Using the service role key for sign-in returns auth errors even
 * with correct credentials. Service role is only for DB reads/writes.
 *
 * Anti-enumeration: All invalid credential states return identical generic 401.
 * The previous 404 vs 401 distinction was a credential enumeration vulnerability
 * — it has been removed. A generic 401 is returned for both user-not-found
 * and wrong-password scenarios.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase, getServerAnonSupabase } from '@/lib/supabase';
import { LoginSchema } from '@/lib/validations/auth';

/** Generic error message — used for ALL auth failures to prevent enumeration */
const GENERIC_AUTH_ERROR = 'Identifiants invalides.';

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

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }

    const { email, password } = parsed.data;

    // ── 3. ATTEMPT SIGN IN (anon key — required for signInWithPassword) ──
    // NOTE: We do NOT pre-check if the user exists. That was an enumeration
    // vulnerability (distinct 404 vs 401). signInWithPassword handles both
    // "user not found" and "wrong password" with the same error code.
    const anonClient = getServerAnonSupabase();
    const { data: authData, error: authError } =
        await anonClient.auth.signInWithPassword({ email, password });

    if (authError) {
        console.warn('[HYDRE] Login attempt failed:', authError.message);
        return NextResponse.json(
            { error: GENERIC_AUTH_ERROR, message: GENERIC_AUTH_ERROR },
            { status: 401 }
        );
    }

    if (!authData.user || !authData.session) {
        console.error('[HYDRE] No user or session returned from signInWithPassword');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    // ── 4. CHECK EMAIL VERIFICATION (service role — bypasses RLS) ────────
    const adminClient = getServerSupabase();
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('email_verified')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        console.warn('[HYDRE] Profile lookup failed for user:', authData.user.id, profileError.message);
        return NextResponse.json(
            { error: 'Email not verified', needsVerification: true },
            { status: 403 }
        );
    }

    if (!profile?.email_verified) {
        return NextResponse.json(
            { error: 'Email not verified', needsVerification: true },
            { status: 403 }
        );
    }

    // ── 5. RETURN SESSION ───────────────────────────────────
    return NextResponse.json(
        {
            success: true,
            session: {
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_at: authData.session.expires_at,
            },
            user: {
                id: authData.user.id,
                email: authData.user.email,
            },
        },
        { status: 200 }
    );
}
