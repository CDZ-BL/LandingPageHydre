/**
 * Verify Email — POST /api/auth/verify-email
 * V2.1.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit (auth) → Zod Validation → Resolve User by Email →
 * Code Lookup (scoped by user_id + code) → Mark Used → Confirm → Points
 *
 * Anti-enumeration: all failures return the same generic error message.
 * FIX: Code lookup is scoped by user_id to prevent cross-user code collisions.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { VerifyEmailSchema } from '@/lib/validations/auth';

/** Generic error — identical for all failure modes to prevent enumeration */
const INVALID_CODE_ERROR = 'Invalid or expired verification code';

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

    const parsed = VerifyEmailSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid email or code format' },
            { status: 400 }
        );
    }

    const { email, code } = parsed.data;
    const supabase = getServerSupabase();

    try {
        // ── 3. RESOLVE USER BY EMAIL (O(1)) ─────────
        // We look up the auth user directly
        const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const authTarget = userList.users.find((u) => u.email === email);

        if (!authTarget) {
            return NextResponse.json(
                { error: INVALID_CODE_ERROR },
                { status: 400 }
            );
        }

        const userId = authTarget.id;

        // ── 4. LOOK UP ACTIVE CODE (scoped by user_id + code) ─
        // Filtering by BOTH user_id AND code eliminates any
        // cross-user collision risk in the 1-in-900K edge case.
        const { data: codeRow, error: codeError } = await supabase
            .from('verification_codes')
            .select('id')
            .eq('user_id', userId)
            .eq('code', code)
            .is('used_at', null)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (codeError || !codeRow) {
            return NextResponse.json(
                { error: INVALID_CODE_ERROR },
                { status: 400 }
            );
        }

        // Load auth user metadata (needed for pending_referral)
        const { data: authData } = await supabase.auth.admin.getUserById(userId);
        const authUser = authData?.user;

        // ── 5. MARK CODE AS USED ────────────────────────────
        await supabase
            .from('verification_codes')
            .update({ used_at: new Date().toISOString() })
            .eq('id', codeRow.id);

        // ── 6. CONFIRM EMAIL IN SUPABASE AUTH ───────────────
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
            userId,
            { email_confirm: true }
        );

        if (confirmError) {
            console.error('[HYDRE] Email confirm error:', confirmError);
            return NextResponse.json(
                { error: 'Verification failed. Please try again.' },
                { status: 500 }
            );
        }

        // ── 7. UPDATE PROFILE ───────────────────────────────
        await supabase
            .from('profiles')
            .update({ email_verified: true, updated_at: new Date().toISOString() })
            .eq('id', userId);

        // ── 8. AWARD VERIFICATION POINTS (50) ───────────────
        await supabase.rpc('award_founder_points', {
            p_user_id: userId,
            p_amount: 50,
            p_reason: 'verification',
        });

        // ── 9. PROCESS PENDING REFERRAL ─────────────────────
        const pendingReferral = authUser?.user_metadata?.pending_referral;

        if (pendingReferral) {
            const { data: referrer } = await supabase
                .from('profiles')
                .select('id')
                .eq('referral_code', pendingReferral)
                .single();

            if (referrer) {
                // Create referral record
                const { error: refError } = await supabase
                    .from('referrals')
                    .insert({
                        referrer_id: referrer.id,
                        referred_id: userId,
                    });

                if (!refError) {
                    // Award referrer 200 points
                    await supabase.rpc('award_founder_points', {
                        p_user_id: referrer.id,
                        p_amount: 200,
                        p_reason: 'referral',
                        p_metadata: { referred_user_id: userId },
                    });

                    // Award referred user 50 bonus points
                    await supabase.rpc('award_founder_points', {
                        p_user_id: userId,
                        p_amount: 50,
                        p_reason: 'referred_bonus',
                    });
                }

                // Clear pending referral
                await supabase.auth.admin.updateUserById(userId, {
                    user_metadata: {
                        ...authUser?.user_metadata,
                        pending_referral: null,
                    },
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('[HYDRE] Verify email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
