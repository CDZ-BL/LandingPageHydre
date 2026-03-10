/**
 * Auth Logout — POST /api/auth/logout
 * V2.1.0-HYDRE Auth System
 *
 * SECURITY PIPELINE:
 * Rate Limit → Token Extraction → Supabase Session Invalidation
 *
 * Server-side sign-out ensures the session token is revoked
 * even if the client fails to clear it properly.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT ───────────────────────────────────────
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    // ── 2. EXTRACT SESSION TOKEN ─────────────────────────────
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json(
            { error: 'No session token provided' },
            { status: 401 }
        );
    }

    // ── 3. INVALIDATE SESSION VIA SUPABASE ────────────────────
    try {
        // Create a client authenticated with the user's token
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: { Authorization: `Bearer ${token}` },
                },
            }
        );

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.warn('[HYDRE] Logout signOut warning:', error.message);
            // Still return success — client should clear token regardless
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (err) {
        console.error('[HYDRE] Logout error:', err);
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    }
}
