import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

/**
 * GET /api/account/stats
 *
 * Returns comprehensive account data for the authenticated user's dashboard.
 * Includes profile info, vote history, referral count, and founder points breakdown.
 *
 * **Auth:** Bearer token (JWT) in Authorization header
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 *
 * @param request - NextRequest with Authorization header
 * @returns 200 with account stats | 401 if token invalid/missing
 */
export async function GET(request: NextRequest) {
  try {
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
    const [profileRes, votesRes, referralsRes, founderPointsRes] = await Promise.all([
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

      // 3. Count referrals
      supabase
        .from('referrals')
        .select('id', { count: 'exact' })
        .eq('referrer_id', userId),

      // 4. Fetch founder points breakdown
      supabase
        .from('founder_points')
        .select('id, amount, reason, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
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

    // Get referral count (Supabase count returns count on meta)
    const referralCount = referralsRes.count || 0;

    // Transform founder points
    const founderPoints = founderPointsRes.data?.map((point: any) => ({
      amount: point.amount,
      reason: point.reason,
      createdAt: point.created_at,
    })) || [];

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
      referralCount,
      founderPoints,
    });
  } catch (error) {
    console.error('Account stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
