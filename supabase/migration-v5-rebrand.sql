-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V5.0 — Rebrand to Smart Nutrition (Referral Codes)
-- Run this in Supabase Dashboard → SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 1. Update the generate_referral_code function to use 'SMART-' prefix natively
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
    RETURN 'SMART-' || result;
END;
$$ LANGUAGE plpgsql;

-- 2. Backfill existing referral codes from 'HYDRE-' to 'SMART-'
UPDATE public.profiles
SET referral_code = REPLACE(referral_code, 'HYDRE-', 'SMART-')
WHERE referral_code LIKE 'HYDRE-%';
