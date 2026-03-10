/**
 * Votes API Route — GET & POST /api/votes
 * V4.0.0-HYDRE-APEX Compliant
 *
 * GET:  Public aggregated results (no user data exposed).
 * POST: Rate-limited, authenticated vote casting.
 *       user_id extracted server-side from Supabase JWT.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';
import { getServerSupabase } from '@/lib/supabase';
import { CastVoteSchema } from '@/lib/validations/votes';

const PG_UNIQUE_VIOLATION = '23505';

// ─────────────────────────────────────────────────────────────
// GET — Public aggregated results
// ─────────────────────────────────────────────────────────────
export async function GET() {
    const supabase = getServerSupabase();

    // Fetch active campaigns
    const { data: campaigns, error: campaignError } = await supabase
        .from('vote_campaigns')
        .select('id, title, description, options, starts_at, ends_at')
        .eq('is_active', true);

    if (campaignError) {
        console.error('[HYDRE] Fetch campaigns error:', campaignError);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    if (!campaigns || campaigns.length === 0) {
        return NextResponse.json({ campaigns: [] }, { status: 200 });
    }

    // Fetch aggregated vote counts per campaign
    const campaignIds = campaigns.map((c) => c.id);
    const { data: votes, error: voteError } = await supabase
        .from('votes')
        .select('campaign_id, selected_option')
        .in('campaign_id', campaignIds);

    if (voteError) {
        console.error('[HYDRE] Fetch votes error:', voteError);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    // Aggregate votes per campaign per option
    const voteCounts = new Map<string, Record<string, number>>();
    for (const vote of votes ?? []) {
        const existing = voteCounts.get(vote.campaign_id) ?? {};
        existing[vote.selected_option] = (existing[vote.selected_option] ?? 0) + 1;
        voteCounts.set(vote.campaign_id, existing);
    }

    const enrichedCampaigns = campaigns.map((campaign) => ({
        ...campaign,
        results: voteCounts.get(campaign.id) ?? {},
        totalVotes: Object.values(voteCounts.get(campaign.id) ?? {}).reduce(
            (sum, count) => sum + count,
            0
        ),
    }));

    return NextResponse.json({ campaigns: enrichedCampaigns }, { status: 200 });
}

// ─────────────────────────────────────────────────────────────
// POST — Cast vote (authenticated)
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    // ── 1. RATE LIMIT ───────────────────────────────────────
    const rateLimitResponse = await applyRateLimit(request, 'mutation');
    if (rateLimitResponse) return rateLimitResponse;

    // ── 2. AUTHENTICATE — Extract user from JWT ─────────────
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    const token = authHeader.slice(7);

    // Validate the user's JWT using the service role client.
    // supabase.auth.getUser(token) verifies the token server-side
    // without needing to create a new client per request.
    const supabase = getServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Invalid or expired session' },
            { status: 401 }
        );
    }

    // ── 3. VALIDATE INPUT ───────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 }
        );
    }

    const parsed = CastVoteSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }

    const { campaignId, selectedOption } = parsed.data;

    // ── 4. VERIFY CAMPAIGN & OPTION ─────────────────────────
    const { data: campaign } = await supabase
        .from('vote_campaigns')
        .select('options, is_active, ends_at')
        .eq('id', campaignId)
        .single();

    if (!campaign || !campaign.is_active) {
        return NextResponse.json(
            { error: 'Campaign not found or inactive' },
            { status: 404 }
        );
    }

    if (campaign.ends_at && new Date(campaign.ends_at) < new Date()) {
        return NextResponse.json(
            { error: 'Campaign has ended' },
            { status: 410 }
        );
    }

    const validOptions = campaign.options as string[];
    if (!validOptions.includes(selectedOption)) {
        return NextResponse.json(
            { error: 'Invalid option for this campaign' },
            { status: 400 }
        );
    }

    // ── 5. CAST VOTE ────────────────────────────────────────
    const { error: insertError } = await supabase
        .from('votes')
        .insert({
            campaign_id: campaignId,
            user_id: user.id,
            selected_option: selectedOption,
        });

    if (insertError) {
        if (insertError.code === PG_UNIQUE_VIOLATION) {
            return NextResponse.json(
                { error: 'You have already voted in this campaign' },
                { status: 409 }
            );
        }
        console.error('[HYDRE] Vote insert error:', insertError);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true }, { status: 201 });
}
