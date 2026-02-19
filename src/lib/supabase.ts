/**
 * Supabase Client Factory — Dual-Mode Initialization
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  Server (API Routes)  →  SERVICE_ROLE_KEY (bypasses RLS)│
 * │  Browser (Auth SDK)   →  ANON_KEY (RLS-enforced)        │
 * └─────────────────────────────────────────────────────────┘
 *
 * The server client is used exclusively in API routes for
 * privileged mutations (waitlist, newsletter inserts).
 * The browser client powers Supabase Auth (magic link flow).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// ─────────────────────────────────────────────────────────────
// SERVER CLIENT — Privileged, RLS-bypassing
// Used ONLY in API routes via SERVICE_ROLE_KEY.
// ─────────────────────────────────────────────────────────────
let serverClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
    if (serverClient) return serverClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            '[HYDRE] Missing SUPABASE env vars. Check .env.local: ' +
            'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
        );
    }

    serverClient = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return serverClient;
}

// ─────────────────────────────────────────────────────────────
// BROWSER CLIENT — RLS-enforced, user-scoped
// Singleton for the client-side Auth flow.
// ─────────────────────────────────────────────────────────────
let browserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
    if (browserClient) return browserClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error(
            '[HYDRE] Missing public SUPABASE env vars. Check .env.local: ' +
            'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
        );
    }

    browserClient = createBrowserClient(url, key);
    return browserClient;
}
