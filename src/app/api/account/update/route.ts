/**
 * Account Update — POST /api/account/update
 * V2.0.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit → Bearer Token Auth → Zod Validation → Profile/Password Update
 *
 * Supports:
 * - Display name update (profiles table)
 * - Password change (requires current password verification)
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { UpdateProfileSchema } from '@/lib/validations/auth';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT ───────────────────────────────────────
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    // ── 2. AUTH ──────────────────────────────────────────────
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Missing or invalid authorization header' },
            { status: 401 }
        );
    }

    const token = authHeader.slice(7);
    const supabase = getServerSupabase();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // ── 3. VALIDATE INPUT ───────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
        return NextResponse.json(
            { error: firstError },
            { status: 400 }
        );
    }

    const { displayName, currentPassword, newPassword } = parsed.data;

    // Must have at least one field to update
    if (!displayName && !newPassword) {
        return NextResponse.json(
            { error: 'No fields to update' },
            { status: 400 }
        );
    }

    try {
        // ── 4. UPDATE DISPLAY NAME ──────────────────────────
        if (displayName !== undefined) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('[HYDRE] Profile update error:', profileError);
                return NextResponse.json(
                    { error: 'Failed to update profile' },
                    { status: 500 }
                );
            }
        }

        // ── 5. CHANGE PASSWORD ──────────────────────────────
        if (newPassword && currentPassword) {
            // Verify current password by attempting signIn
            const verifyClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error: verifyError } = await verifyClient.auth.signInWithPassword({
                email: user.email!,
                password: currentPassword,
            });

            if (verifyError) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 403 }
                );
            }

            // Update password via admin
            const { error: pwError } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: newPassword }
            );

            if (pwError) {
                console.error('[HYDRE] Password update error:', pwError);
                return NextResponse.json(
                    { error: 'Failed to update password' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('[HYDRE] Account update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
