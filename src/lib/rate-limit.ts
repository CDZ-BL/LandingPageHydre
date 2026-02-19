/**
 * Rate Limiter — Upstash Redis Sliding Window
 * V4.0.0-HYDRE-APEX Compliant
 *
 * SECURITY:
 * ┌─────────────────────────────────────────────────────────┐
 * │  Algorithm: Sliding Window (accurate, no burst spikes)  │
 * │  Limit:     3 requests per IP per 60-second window      │
 * │  Breach:    429 Too Many Requests                       │
 * └─────────────────────────────────────────────────────────┘
 *
 * Applied to all mutation endpoints (/api/waitlist,
 * /api/newsletter, /api/votes POST).
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────
// RATE LIMITER INSTANCE — Module-scope singleton
// ─────────────────────────────────────────────────────────────
let rateLimiter: Ratelimit | null = null;

function getRateLimiter(): Ratelimit {
    if (rateLimiter) return rateLimiter;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error(
            '[HYDRE] Missing Upstash env vars. Check .env.local: ' +
            'UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN'
        );
    }

    rateLimiter = new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(3, '60 s'),
        analytics: true,
        prefix: 'hydre:ratelimit',
    });

    return rateLimiter;
}

// ─────────────────────────────────────────────────────────────
// RATE LIMIT GUARD — Call at the top of mutation handlers
// Returns null if allowed, or a 429 Response if breached.
// ─────────────────────────────────────────────────────────────

/** IP extraction from request headers (Vercel-compatible) */
function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        '127.0.0.1'
    );
}

/**
 * Enforces rate limiting on a request.
 * @returns `null` if the request is within limits, or a `NextResponse` 429 if breached.
 */
export async function applyRateLimit(
    request: NextRequest
): Promise<NextResponse | null> {
    const ip = getClientIp(request);
    const limiter = getRateLimiter();
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': String(remaining),
                    'X-RateLimit-Reset': String(reset),
                    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
                },
            }
        );
    }

    return null;
}
