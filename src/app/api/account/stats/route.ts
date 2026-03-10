import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { applyRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/account/stats
 *
 * Returns comprehensive account data for the authenticated user's dashboard.
 * Includes profile info, vote history, referral count, founder points breakdown,
 * and cashback wallet summary.
 *
 * **Auth:** Bearer token (JWT) in Authorization header
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 *
 * @param request - NextRequest with Authorization header
 * @returns 200 with account stats | 401 if token invalid/missing
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limit
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const supabase = getServerSupabase();

    // Verify token and get authenticated user
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

    // Run all queries in parallel
    const [profileRes, votesRes, referralsRes, founderPointsRes, walletRes] = await Promise.all([
      // 1. Fetch user profile
      supabase
        .from('profiles')
        .select('id, email, display_name, referral_code, email_verified, founder_points_total, created_at')
        .eq('id', userId)
        .single(),

      // 2. Fetch vote history with campaign details
      supabase
        .from('votes')
        .select(
          `
          id,
          campaign_id,
          selected_option,
          voted_at,
          vote_campaigns!inner(id, title, is_active)
          `
        )
        .eq('user_id', userId)
        .order('voted_at', { ascending: false }),

      // 3. Fetch referrals with details
      supabase
        .from('referrals')
        .select('id, referred_id, created_at')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false }),

      // 4. Fetch founder points breakdown
      supabase
        .from('founder_points')
        .select('id, amount, reason, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),

      // 5. Fetch cashback wallet summary
      supabase
        .from('cashback_wallets')
        .select('balance_cents, lifetime_earned_cents, lifetime_spent_cents')
        .eq('user_id', userId)
        .single(),
    ]);

    // Handle errors
    if (profileRes.error) {
      console.error('Profile fetch error:', profileRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (votesRes.error) {
      console.error('Votes fetch error:', votesRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    if (founderPointsRes.error) {
      console.error('Founder points fetch error:', founderPointsRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch founder points' },
        { status: 500 }
      );
    }

    const profile = profileRes.data;

    // Transform votes response
    const votes = votesRes.data?.map((vote: any) => ({
      campaignId: vote.campaign_id,
      campaignTitle: vote.vote_campaigns.title,
      selectedOption: vote.selected_option,
      votedAt: vote.voted_at,
      isActive: vote.vote_campaigns.is_active,
    })) || [];

    // Transform referrals
    const referralsList = referralsRes.data?.map((ref: any) => ({
      referredName: `Membre #${(ref.referred_id as string).slice(0, 6)}`,
      joinedAt: ref.created_at,
      pointsEarned: 200, // Fixed points per referral
    })) || [];

    // Calculate referral points from founder_points for accuracy
    const referralPoints = founderPointsRes.data
      ?.filter((p: any) => p.reason === 'referral')
      .reduce((sum: number, p: any) => sum + p.amount, 0) ?? 0;

    // Transform founder points
    const points = founderPointsRes.data?.map((point: any) => ({
      amount: point.amount,
      reason: point.reason,
      createdAt: point.created_at,
    })) || [];

    // Wallet data (graceful fallback if table not yet migrated)
    const wallet = walletRes.error
      ? { balance_cents: 0, lifetime_earned_cents: 0, lifetime_spent_cents: 0 }
      : walletRes.data;

    return NextResponse.json({
      profile: {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        referralCode: profile.referral_code,
        emailVerified: profile.email_verified,
        founderPointsTotal: profile.founder_points_total,
        createdAt: profile.created_at,
      },
      votes,
      points,
      referrals: {
        list: referralsList,
        total: referralsList.length,
        totalPoints: referralPoints,
      },
      wallet: {
        balanceCents: wallet.balance_cents ?? 0,
        lifetimeEarnedCents: wallet.lifetime_earned_cents ?? 0,
        lifetimeSpentCents: wallet.lifetime_spent_cents ?? 0,
      },
    });
  } catch (error) {
    console.error('Account stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
