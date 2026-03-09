/**
 * Auth Callback Route — GET /api/auth/callback
 * V4.0.0-HYDRE-APEX Compliant
 *
 * Handles the redirect from Supabase magic link emails.
 * Exchanges the one-time code for a session, then redirects
 * the user to the landing page.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/** Force dynamic rendering — this route reads request.url */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    // Whitelist: only relative paths allowed — prevents open redirect attacks
    const rawNext = searchParams.get('next') ?? '/';
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

    if (!code) {
        // No code → redirect to home
        return NextResponse.redirect(new URL('/', request.url));
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('[HYDRE] Missing Supabase env vars in auth callback');
        return NextResponse.redirect(new URL('/', request.url));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error('[HYDRE] Auth code exchange failed:', error);
        return NextResponse.redirect(new URL('/?auth=error', request.url));
    }

    return NextResponse.redirect(new URL(next, request.url));
}
