import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { applyRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/account/wallet
 *
 * Returns the authenticated user's cashback wallet balance and transaction history.
 * No PII is exposed — related users are referenced by masked identifiers only.
 *
 * **Auth:** Bearer token (JWT) in Authorization header
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 * **Security:** RLS-enforced + SERVICE_ROLE for cross-table joins
 *
 * @returns 200 with wallet data | 401 if unauthorized
 */
export async function GET(request: NextRequest) {
    try {
        // ── Rate limit (read tier — 20 req/IP/60s) ──
        const rateLimitResponse = await applyRateLimit(request, 'read');
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

        const userId = user.id;

        // ── Parse query params ───────────────────────
        const url = new URL(request.url);
        const limit = Math.min(
            Math.max(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 1),
            100
        );
        const offset = Math.max(
            parseInt(url.searchParams.get('offset') || '0', 10) || 0,
            0
        );

        // ── Fetch wallet + transactions in parallel ──
        const [walletRes, transactionsRes] = await Promise.all([
            // 1. Wallet balance
            supabase
                .from('cashback_wallets')
                .select('id, balance_cents, lifetime_earned_cents, lifetime_spent_cents, updated_at')
                .eq('user_id', userId)
                .single(),

            // 2. Transaction history (most recent first)
            supabase
                .from('cashback_transactions')
                .select('id, type, amount_cents, source_order_id, created_at, metadata')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1),
        ]);

        // Handle wallet not found (shouldn't happen if trigger works, but be safe)
        if (walletRes.error && walletRes.error.code === 'PGRST116') {
            // No wallet found — return empty state
            return NextResponse.json({
                wallet: {
                    balanceCents: 0,
                    lifetimeEarnedCents: 0,
                    lifetimeSpentCents: 0,
                },
                transactions: [],
                pagination: { limit, offset, hasMore: false },
            });
        }

        if (walletRes.error) {
            console.error('Wallet fetch error:', walletRes.error);
            return NextResponse.json(
                { error: 'Failed to fetch wallet' },
                { status: 500 }
            );
        }

        if (transactionsRes.error) {
            console.error('Transactions fetch error:', transactionsRes.error);
            return NextResponse.json(
                { error: 'Failed to fetch transactions' },
                { status: 500 }
            );
        }

        const wallet = walletRes.data;

        // ── Transform transactions (strip PII) ──────
        interface TransactionRow {
            id: string;
            type: string;
            amount_cents: number;
            source_order_id: string | null;
            created_at: string;
            metadata: Record<string, unknown> | null;
        }

        const transactions = (transactionsRes.data || []).map((tx: TransactionRow) => ({
            id: tx.id,
            type: tx.type,
            amountCents: tx.amount_cents,
            // Only expose order ID existence, not full UUID in metadata
            hasOrder: !!tx.source_order_id,
            createdAt: tx.created_at,
            // Sanitize metadata: only expose rate and order_total_cents
            details: {
                rate: tx.metadata?.rate || null,
                orderTotalCents: tx.metadata?.order_total_cents || null,
            },
        }));

        const hasMore = transactions.length === limit;

        return NextResponse.json({
            wallet: {
                balanceCents: wallet.balance_cents,
                lifetimeEarnedCents: wallet.lifetime_earned_cents,
                lifetimeSpentCents: wallet.lifetime_spent_cents,
            },
            transactions,
            pagination: { limit, offset, hasMore },
        });
    } catch (error) {
        console.error('Wallet endpoint error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
