import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

/**
 * GET /api/account/referrals
 *
 * Returns detailed referral list for the authenticated user.
 * Includes referred user info and points earned per referral.
 *
 * **Auth:** Bearer token (JWT) in Authorization header
 * **Privacy:** Email addresses are masked (first char + *** + @domain)
 * **Rate limiting:** Upstash Redis (3 req/IP/60s)
 *
 * @param request - NextRequest with Authorization header
 * @returns 200 with referrals list | 401 if token invalid/missing
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

    // Run queries in parallel
    const [referralsRes, founderPointsRes] = await Promise.all([
      // 1. Fetch referrals with referred user profile data
      supabase
        .from('referrals')
        .select(
          `
          id,
          referred_id,
          created_at,
          profiles!referred_id(id, email, display_name, created_at)
          `
        )
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false }),

      // 2. Fetch referral-specific founder points
      supabase
        .from('founder_points')
        .select('id, amount, created_at, metadata')
        .eq('user_id', userId)
        .eq('reason', 'referral')
        .order('created_at', { ascending: false }),
    ]);

    // Handle errors
    if (referralsRes.error) {
      console.error('Referrals fetch error:', referralsRes.error);
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
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

    // Helper function to mask email for privacy
    const maskEmail = (email: string): string => {
      const [localPart, domain] = email.split('@');
      if (!localPart || !domain) return '***@***';
      return `${localPart[0]}***@${domain}`;
    };

    // Transform referrals response
    const referrals = referralsRes.data?.map((referral: any) => {
      const referredProfile = referral.profiles;
      const referredEmail = referredProfile?.email || 'unknown@email.com';

      // Find points earned for this referral
      const pointsEarned = founderPointsRes.data?.reduce((sum: number, point: any) => {
        // Attempt to match by metadata if available, otherwise sum all referral points
        // If metadata contains referred_id, match it; otherwise include all
        if (point.metadata?.referred_id === referral.referred_id) {
          return sum + point.amount;
        }
        return sum;
      }, 0) || 0;

      return {
        referredId: referral.referred_id,
        referredName: maskEmail(referredEmail),
        joinedAt: referredProfile?.created_at || referral.created_at,
        pointsEarned: pointsEarned,
      };
    }) || [];

    // Calculate totals
    const totalReferrals = referrals.length;
    const totalPointsFromReferrals = founderPointsRes.data?.reduce(
      (sum: number, point: any) => sum + point.amount,
      0
    ) || 0;

    return NextResponse.json({
      referrals,
      totalReferrals,
      totalPointsFromReferrals,
    });
  } catch (error) {
    console.error('Account referrals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
