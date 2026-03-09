import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { applyRateLimit } from '@/lib/rate-limit';
import { ProcessPurchaseCashbackSchema } from '@/lib/validations/cashback';

/**
 * POST /api/cashback/process-purchase
 *
 * INTERNAL/SERVER-ONLY endpoint. Processes cashback for a completed purchase.
 * Credits 5% to buyer's wallet + 5% to referrer's wallet (if applicable).
 *
 * **Auth:** x-api-secret header (server-to-server, NOT user-facing)
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 * **Security:** This endpoint MUST NEVER be called from the client.
 *              It is meant to be called from the checkout/order system only.
 *
 * @param request - NextRequest with x-api-secret header and JSON body
 * @returns 200 with cashback amounts | 401/403/422/500 on error
 */
export async function POST(request: NextRequest) {
    try {
        // ── Rate limit ───────────────────────────────
        const rateLimitResponse = await applyRateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;

        // ── Server-to-server auth ────────────────────
        const apiSecret = request.headers.get('x-api-secret');
        const expectedSecret = process.env.CASHBACK_API_SECRET;

        if (!expectedSecret) {
            console.error('CASHBACK_API_SECRET not configured');
            return NextResponse.json(
                { error: 'Service unavailable' },
                { status: 503 }
            );
        }

        if (!apiSecret || apiSecret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // ── Validate body ────────────────────────────
        const body = await request.json();
        const validation = ProcessPurchaseCashbackSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { buyer_id, order_id, order_total_cents } = validation.data;
        const supabase = getServerSupabase();

        // ── Verify buyer exists ──────────────────────
        const { data: buyerProfile, error: buyerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', buyer_id)
            .single();

        if (buyerError || !buyerProfile) {
            return NextResponse.json(
                { error: 'Invalid buyer' },
                { status: 422 }
            );
        }

        // ── Idempotency check: prevent double-processing ──
        const { data: existingTx } = await supabase
            .from('cashback_transactions')
            .select('id')
            .eq('source_order_id', order_id)
            .eq('type', 'purchase_self_cashback')
            .limit(1);

        if (existingTx && existingTx.length > 0) {
            // Already processed — return success silently (anti-enumeration)
            return NextResponse.json({
                processed: true,
                buyerCashbackCents: 0,
                referrerCashbackCents: 0,
                message: 'Already processed',
            });
        }

        // ── Process cashback via DB function ─────────
        const { data: result, error: processError } = await supabase
            .rpc('process_purchase_cashback', {
                p_buyer_id: buyer_id,
                p_order_id: order_id,
                p_order_total_cents: order_total_cents,
            });

        if (processError) {
            console.error('Cashback processing error:', processError);
            return NextResponse.json(
                { error: 'Failed to process cashback' },
                { status: 500 }
            );
        }

        // Result is an array with one row from the RETURNS TABLE function
        const row = Array.isArray(result) ? result[0] : result;

        return NextResponse.json({
            processed: true,
            buyerCashbackCents: row?.buyer_cashback || 0,
            referrerCashbackCents: row?.referrer_cashback || 0,
            // Never expose referrer_id or any user identifiers
        });
    } catch (error) {
        console.error('Process purchase cashback error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
