-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V2.0 — Auth & Founder Points Migration
-- Run this in Supabase Dashboard → SQL Editor
-- Requires: migration.sql (V1) already applied
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── EXTEND PROFILES ───────────────────────────────────────

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS founder_points_total INT DEFAULT 0;

-- ── VERIFICATION CODES ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL CHECK (char_length(code) = 6),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id
    ON public.verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup
    ON public.verification_codes(user_id, code)
    WHERE used_at IS NULL;

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
-- No client policies → SERVICE_ROLE only (default deny)

-- ── REFERRALS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer
    ON public.referrals(referrer_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own referrals as referrer" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id);

-- ── FOUNDER POINTS (append-only ledger) ───────────────────

CREATE TABLE IF NOT EXISTS public.founder_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN (
        'signup', 'verification', 'referral', 'referred_bonus',
        'vote', 'newsletter', 'bonus'
    )),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_founder_points_user
    ON public.founder_points(user_id);

ALTER TABLE public.founder_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own points" ON public.founder_points
    FOR SELECT USING (auth.uid() = user_id);

-- ── HELPER: Generate unique referral code ─────────────────

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN 'HYDRE-' || result;
END;
$$ LANGUAGE plpgsql;

-- ── HELPER: Award founder points + update denormalized total

CREATE OR REPLACE FUNCTION public.award_founder_points(
    p_user_id UUID,
    p_amount INT,
    p_reason TEXT,
    p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.founder_points (user_id, amount, reason, metadata)
    VALUES (p_user_id, p_amount, p_reason, p_metadata);

    UPDATE public.profiles
    SET founder_points_total = founder_points_total + p_amount,
        updated_at = now()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── UPDATE: handle_new_user trigger ───────────────────────
-- Now also generates referral_code + awards signup points

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    ref_code TEXT;
    code_exists BOOLEAN;
BEGIN
    -- Generate unique referral code
    LOOP
        ref_code := public.generate_referral_code();
        SELECT EXISTS(
            SELECT 1 FROM public.profiles WHERE referral_code = ref_code
        ) INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;

    -- Create profile with referral code
    INSERT INTO public.profiles (id, referral_code)
    VALUES (new.id, ref_code);

    -- Award signup points (100)
    PERFORM public.award_founder_points(new.id, 100, 'signup');

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── TRIGGER: Auto-award points on vote ────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_vote()
RETURNS trigger AS $$
BEGIN
    PERFORM public.award_founder_points(
        new.user_id, 50, 'vote',
        jsonb_build_object('campaign_id', new.campaign_id)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_vote_cast
    AFTER INSERT ON public.votes
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_vote();
