/**
 * Resend Email Client — Singleton Factory
 * V4.0.0-HYDRE-APEX Compliant
 *
 * Provides the Resend SDK instance for transactional
 * and newsletter email dispatch from API routes.
 */

import { Resend } from 'resend';

let client: Resend | null = null;

export function getResend(): Resend {
    if (client) return client;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error(
            '[HYDRE] Missing RESEND_API_KEY. Check .env.local.'
        );
    }

    client = new Resend(apiKey);
    return client;
}

/** Sender address — defaults to Resend sandbox */
export const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
