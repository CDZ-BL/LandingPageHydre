/**
 * Newsletter API Route — POST & DELETE /api/newsletter
 * V4.0.0-HYDRE-APEX Compliant
 *
 * POST:   Rate-limited subscribe with anti-enumeration (23505 → 200).
 * DELETE: Soft unsubscribe (is_active = false).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { getResend, FROM_EMAIL } from '@/lib/resend';
import {
    NewsletterSubscribeSchema,
    NewsletterUnsubscribeSchema,
} from '@/lib/validations/newsletter';
import { NewsletterConfirmation } from '@/emails/NewsletterConfirmation';

const PG_UNIQUE_VIOLATION = '23505';

// ─────────────────────────────────────────────────────────────
// POST — Subscribe
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    const parsed = NewsletterSubscribeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid email address' },
            { status: 400 }
        );
    }

    const { email } = parsed.data;
    const supabase = getServerSupabase();

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

    if (error) {
        if (error.code === PG_UNIQUE_VIOLATION) {
            return NextResponse.json({ success: true }, { status: 200 });
        }
        console.error('[HYDRE] Newsletter subscribe error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    // Confirmation email (non-blocking)
    try {
        const resend = getResend();
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Inscription confirmée — HYDRE',
            react: NewsletterConfirmation({ email }),
        });
    } catch (emailError) {
        console.error('[HYDRE] Newsletter confirmation email failed:', emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
}

// ─────────────────────────────────────────────────────────────
// DELETE — Soft Unsubscribe
// ─────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    const parsed = NewsletterUnsubscribeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid email address' },
            { status: 400 }
        );
    }

    const { email } = parsed.data;
    const supabase = getServerSupabase();

    // Soft delete — always returns 200 (anti-enumeration)
    await supabase
        .from('newsletter_subscribers')
        .update({
            is_active: false,
            unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email);

    return NextResponse.json({ success: true }, { status: 200 });
}
