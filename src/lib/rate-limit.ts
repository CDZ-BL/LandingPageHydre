/**
 * Rate Limiter — Upstash Redis Sliding Window
 * V4.0.0-HYDRE-APEX Compliant
 *
 * SECURITY — Per-route tiered buckets:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  AUTH   (auth:*)        →  3  req / IP / 60s  (strictest)   │
 * │  MUTATION (waitlist, …) →  5  req / IP / 60s               │
 * │  READ   (stats, wallet) →  20 req / IP / 60s               │
 * │  Breach → 429 Too Many Requests                              │
 * └──────────────────────────────────────────────────────────────┘
 *
 * Using separate Redis key prefixes per tier so one endpoint
 * cannot consume another's budget.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────
// Tier types
// ─────────────────────────────────────────────────────────────
export type RateLimitTier = 'auth' | 'mutation' | 'read';

// ─────────────────────────────────────────────────────────────
// Singleton limiter instances — one per tier
// ─────────────────────────────────────────────────────────────
const limiters: Partial<Record<RateLimitTier, Ratelimit>> = {};

function getRedis(): Redis {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error(
            '[HYDRE] Missing Upstash env vars. Check .env.local: ' +
            'UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN'
        );
    }

    return new Redis({ url, token });
}

const TIER_CONFIG: Record<RateLimitTier, { requests: number; window: `${number} ${'s' | 'm' | 'h'}` }> = {
    /** Auth-sensitive — login, signup, resend-code (3 req/IP/60s) */
    auth: { requests: 3, window: '60 s' },
    /** Public mutations — waitlist, newsletter, votes POST (5 req/IP/60s) */
    mutation: { requests: 5, window: '60 s' },
    /** Authenticated reads — stats, wallet, referrals (20 req/IP/60s) */
    read: { requests: 20, window: '60 s' },
};

function getLimiter(tier: RateLimitTier): Ratelimit {
    if (limiters[tier]) return limiters[tier]!;

    const { requests, window } = TIER_CONFIG[tier];

    limiters[tier] = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(requests, window),
        analytics: true,
        prefix: `hydre:rl:${tier}`,
    });

    return limiters[tier]!;
}

// ─────────────────────────────────────────────────────────────
// IP extraction — Vercel-compatible
// ─────────────────────────────────────────────────────────────
function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        '127.0.0.1'
    );
}

// ─────────────────────────────────────────────────────────────
// RATE LIMIT GUARD
// Returns null if allowed, 429 NextResponse if breached.
// ─────────────────────────────────────────────────────────────

/**
 * Enforces rate limiting on a request using the specified tier.
 *
 * @param request - The incoming NextRequest
 * @param tier    - Rate limit tier: 'auth' | 'mutation' | 'read'
 * @returns `null` if within limits, or a 429 `NextResponse` if breached.
 */
export async function applyRateLimit(
    request: NextRequest,
    tier: RateLimitTier = 'mutation'
): Promise<NextResponse | null> {
    const ip = getClientIp(request);
    const limiter = getLimiter(tier);
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
