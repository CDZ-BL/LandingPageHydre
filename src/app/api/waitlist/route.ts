/**
 * Waitlist API Route — POST /api/waitlist
 * V4.0.0-HYDRE-APEX Compliant
 *
 * SECURITY PIPELINE:
 * Rate Limit → Zod Validation → SERVICE_ROLE Insert → Resend Email
 *
 * Anti-enumeration: Postgres 23505 (unique violation) returns
 * 200 OK silently — never reveals if an email already exists.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import { WaitlistSchema } from '@/lib/validations/waitlist';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

/** Postgres unique_violation error code */
const PG_UNIQUE_VIOLATION = '23505';

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

    const parsed = WaitlistSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid email address' },
            { status: 400 }
        );
    }

    const { email, source } = parsed.data;

    // ── 3. INSERT VIA SERVICE_ROLE (bypasses RLS) ───────────
    const supabase = getServerSupabase();
    const { error } = await supabase
        .from('waitlist')
        .insert({ email, source });

    if (error) {
        // Anti-enumeration: unique violation → silent 200
        if (error.code === PG_UNIQUE_VIOLATION) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        console.error('[HYDRE] Waitlist insert error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    // ── 4. SEND WELCOME EMAIL ───────────────────────────────
    try {
        const resend = getResend();
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Bienvenue dans l\'Alliance HYDRE',
            react: WelcomeEmail({ email }),
        });
    } catch (emailError) {
        // Non-blocking: email failure should not break the waitlist flow
        console.error('[HYDRE] Welcome email failed:', emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
}
