/**
 * Auth Login — POST /api/auth/login
 * V2.0.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit → Zod Validation → Supabase Auth (signInWithPassword) →
 * Email Verification Check → Session Return
 *
 * Anti-enumeration: Invalid credentials return generic 401 error.
 * Email verification is required before login succeeds.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { LoginSchema } from '@/lib/validations/auth';

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

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }

    const { email, password } = parsed.data;

    // ── 3. ATTEMPT SIGN IN ──────────────────────────────────
    const supabase = getServerSupabase();
    const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (authError) {
        // Anti-enumeration: Never distinguish between invalid email or password
        console.warn('[HYDRE] Login attempt failed');
        return NextResponse.json(
            { error: 'Invalid credentials' },
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

    // ── 4. CHECK EMAIL VERIFICATION ─────────────────────────
    // Query the profiles table for email_verified status
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        // If profile doesn't exist or query fails, treat as not verified
        console.warn('[HYDRE] Profile lookup failed for user:', authData.user.id);
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
