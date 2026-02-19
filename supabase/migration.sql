-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V1.0 — Database Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'landing',
    joined_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.vote_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    options JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ DEFAULT now(),
    ends_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.vote_campaigns(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_option TEXT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(campaign_id, user_id)
);

-- ── ROW LEVEL SECURITY — Default Deny ──────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update only their own row
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Waitlist: NO client access (SERVICE_ROLE only)
-- (no policy = default deny)

-- Newsletter: NO client access (SERVICE_ROLE only)
-- (no policy = default deny)

-- Vote campaigns: public read on active campaigns
CREATE POLICY "Public read active campaigns" ON public.vote_campaigns
    FOR SELECT USING (is_active = true);

-- Votes: authenticated users insert/read their own
CREATE POLICY "Users cast own vote" ON public.votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own votes" ON public.votes
    FOR SELECT USING (auth.uid() = user_id);

-- ── AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
