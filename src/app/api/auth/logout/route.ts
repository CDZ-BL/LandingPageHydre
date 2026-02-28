/**
 * Auth Logout — POST /api/auth/logout
 * V2.0.0-HYDRE Auth System
 *
 * IMPLEMENTATION NOTES:
 * The actual session termination happens client-side via the
 * Supabase Auth SDK (supabase.auth.signOut()).
 *
 * This endpoint exists for:
 * - Server-side session invalidation hooks (if needed in future)
 * - Client convenience / symmetry with login endpoint
 * - Potential server-side audit logging of logout events
 *
 * Currently, it simply validates the token presence and returns success.
 */

import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    // ── 1. EXTRACT SESSION TOKEN ─────────────────────────────
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json(
            { error: 'No session token provided' },
            { status: 401 }
        );
    }

    // ── 2. RETURN SUCCESS ────────────────────────────────────
    // Token validation could be added here if needed for audit purposes.
    // For now, we trust the client to have a valid session.

    return NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    );
}
