import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { applyRateLimit } from '@/lib/rate-limit';
import { RedeemCashbackSchema } from '@/lib/validations/cashback';

/**
 * POST /api/cashback/redeem
 *
 * Redeems store credit from the authenticated user's cashback wallet.
 * Debits the specified amount and links it to an order.
 *
 * **Auth:** Bearer token (JWT) in Authorization header
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 * **Security:** Balance check is atomic (SELECT FOR UPDATE in DB function)
 *
 * @param request - NextRequest with Authorization header and JSON body
 * @returns 200 with new balance | 401/422/500 on error
 */
export async function POST(request: NextRequest) {
    try {
        // ── Rate limit ───────────────────────────────
        const rateLimitResponse = await applyRateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;

        // ── Auth ─────────────────────────────────────
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid authorization header' },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7);
        const supabase = getServerSupabase();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // ── Validate body ────────────────────────────
        const body = await request.json();
        const validation = RedeemCashbackSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { amount_cents, order_id } = validation.data;

        // ── Redeem via DB function (atomic) ──────────
        const { data: result, error: redeemError } = await supabase
            .rpc('redeem_cashback', {
                p_user_id: user.id,
                p_amount_cents: amount_cents,
                p_source_order_id: order_id,
                p_metadata: JSON.stringify({ redeemed_via: 'api' }),
            });

        if (redeemError) {
            // Check for insufficient balance
            if (redeemError.message?.includes('Insufficient balance')) {
                return NextResponse.json(
                    { error: 'Insufficient balance' },
                    { status: 422 }
                );
            }

            console.error('Cashback redemption error:', redeemError);
            return NextResponse.json(
                { error: 'Failed to redeem cashback' },
                { status: 500 }
            );
        }

        // ── Fetch updated balance ────────────────────
        const { data: wallet } = await supabase
            .from('cashback_wallets')
            .select('balance_cents')
            .eq('user_id', user.id)
            .single();

        return NextResponse.json({
            redeemed: true,
            redeemedCents: amount_cents,
            newBalanceCents: wallet?.balance_cents ?? 0,
        });
    } catch (error) {
        console.error('Cashback redeem error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
