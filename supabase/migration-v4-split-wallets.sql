-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V4.2 — Idempotent Split Cashback & Commission Wallets
-- Run this in Supabase Dashboard → SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── 1. Create base tables if they don't exist (V3 fallback) ──

CREATE TABLE IF NOT EXISTS public.cashback_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    balance_cents INT DEFAULT 0,
    lifetime_earned_cents INT DEFAULT 0,
    lifetime_spent_cents INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cashback_wallets_user ON public.cashback_wallets(user_id);
ALTER TABLE public.cashback_wallets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users read own wallet" ON public.cashback_wallets;
    CREATE POLICY "Users read own wallet" ON public.cashback_wallets FOR SELECT USING (auth.uid() = user_id);
END $$;


CREATE TABLE IF NOT EXISTS public.cashback_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.cashback_wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount_cents INT NOT NULL,       
    source_order_id UUID,            
    related_user_id UUID,            
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cashback_tx_wallet ON public.cashback_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_cashback_tx_user ON public.cashback_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_cashback_tx_type ON public.cashback_transactions(type);
CREATE INDEX IF NOT EXISTS idx_cashback_tx_order ON public.cashback_transactions(source_order_id) WHERE source_order_id IS NOT NULL;
ALTER TABLE public.cashback_transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users read own cashback transactions" ON public.cashback_transactions;
    CREATE POLICY "Users read own cashback transactions" ON public.cashback_transactions FOR SELECT USING (auth.uid() = user_id);
END $$;


-- ── 2. Add new V4 columns if they don't exist ──────────────

ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS cashback_balance_cents INT NOT NULL DEFAULT 0;
ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS lifetime_cashback_earned_cents INT NOT NULL DEFAULT 0;
ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS lifetime_cashback_spent_cents INT NOT NULL DEFAULT 0;

ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS commission_balance_cents INT NOT NULL DEFAULT 0;
ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS lifetime_commission_earned_cents INT NOT NULL DEFAULT 0;
ALTER TABLE public.cashback_wallets ADD COLUMN IF NOT EXISTS lifetime_commission_withdrawn_cents INT NOT NULL DEFAULT 0;

-- ── 3. Backfill data from old V3 columns to V4 columns ─────

DO $$ 
BEGIN
    -- If balance_cents exists in the schema, it means we came from V3 and need to backfill
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cashback_wallets' AND column_name = 'balance_cents') THEN
        
        -- Copy base balances over
        UPDATE public.cashback_wallets 
        SET cashback_balance_cents = COALESCE(balance_cents, 0),
            lifetime_cashback_earned_cents = COALESCE(lifetime_earned_cents, 0),
            lifetime_cashback_spent_cents = COALESCE(lifetime_spent_cents, 0);

        -- Process referral cashbacks to move them from cashback to commission
        DECLARE
            w RECORD;
            referral_total INT;
        BEGIN
            FOR w IN SELECT id, user_id FROM public.cashback_wallets LOOP
                SELECT COALESCE(SUM(amount_cents), 0) INTO referral_total
                FROM public.cashback_transactions
                WHERE user_id = w.user_id AND type = 'referral_cashback' AND amount_cents > 0;

                IF referral_total > 0 THEN
                    UPDATE public.cashback_wallets
                    SET cashback_balance_cents = GREATEST(cashback_balance_cents - referral_total, 0),
                        lifetime_cashback_earned_cents = GREATEST(lifetime_cashback_earned_cents - referral_total, 0),
                        commission_balance_cents = referral_total,
                        lifetime_commission_earned_cents = referral_total
                    WHERE id = w.id;
                END IF;
            END LOOP;
        END;
        
        -- Finally, drop the old V3 columns
        ALTER TABLE public.cashback_wallets DROP COLUMN balance_cents;
        ALTER TABLE public.cashback_wallets DROP COLUMN lifetime_earned_cents;
        ALTER TABLE public.cashback_wallets DROP COLUMN lifetime_spent_cents;
    END IF;
END $$;

-- ── 4. Ensure correct constraints for transactions ─────────

ALTER TABLE public.cashback_transactions DROP CONSTRAINT IF EXISTS cashback_transactions_type_check;
ALTER TABLE public.cashback_transactions ADD CONSTRAINT cashback_transactions_type_check
    CHECK (type IN (
        'purchase_self_cashback',    
        'referral_cashback',         
        'redemption',                
        'commission_withdrawal'      
    ));

-- ── 5. Re-create all RPCs ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.ensure_cashback_wallet(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    w_id UUID;
BEGIN
    SELECT id INTO w_id FROM public.cashback_wallets WHERE user_id = p_user_id;
    IF w_id IS NULL THEN
        INSERT INTO public.cashback_wallets (user_id) VALUES (p_user_id)
        ON CONFLICT (user_id) DO NOTHING RETURNING id INTO w_id;
        IF w_id IS NULL THEN
            SELECT id INTO w_id FROM public.cashback_wallets WHERE user_id = p_user_id;
        END IF;
    END IF;
    RETURN w_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.credit_cashback(
    p_user_id UUID, p_amount_cents INT, p_type TEXT,
    p_source_order_id UUID DEFAULT NULL, p_related_user_id UUID DEFAULT NULL, p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    w_id UUID; tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN RAISE EXCEPTION 'Credit amount must be positive'; END IF;
    w_id := public.ensure_cashback_wallet(p_user_id);
    INSERT INTO public.cashback_transactions (wallet_id, user_id, type, amount_cents, source_order_id, related_user_id, metadata)
    VALUES (w_id, p_user_id, p_type, p_amount_cents, p_source_order_id, p_related_user_id, p_metadata) RETURNING id INTO tx_id;

    IF p_type = 'referral_cashback' THEN
        UPDATE public.cashback_wallets
        SET commission_balance_cents = commission_balance_cents + p_amount_cents,
            lifetime_commission_earned_cents = lifetime_commission_earned_cents + p_amount_cents, updated_at = now()
        WHERE id = w_id;
    ELSE
        UPDATE public.cashback_wallets
        SET cashback_balance_cents = cashback_balance_cents + p_amount_cents,
            lifetime_cashback_earned_cents = lifetime_cashback_earned_cents + p_amount_cents, updated_at = now()
        WHERE id = w_id;
    END IF;
    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.redeem_cashback(
    p_user_id UUID, p_amount_cents INT, p_source_order_id UUID DEFAULT NULL, p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    w_id UUID; current_balance INT; tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN RAISE EXCEPTION 'Redemption amount must be positive'; END IF;
    SELECT id, cashback_balance_cents INTO w_id, current_balance FROM public.cashback_wallets WHERE user_id = p_user_id FOR UPDATE;
    IF w_id IS NULL THEN RAISE EXCEPTION 'No wallet found for user'; END IF;
    IF current_balance < p_amount_cents THEN RAISE EXCEPTION 'Insufficient balance'; END IF;

    INSERT INTO public.cashback_transactions (wallet_id, user_id, type, amount_cents, source_order_id, metadata)
    VALUES (w_id, p_user_id, 'redemption', -p_amount_cents, p_source_order_id, p_metadata) RETURNING id INTO tx_id;

    UPDATE public.cashback_wallets
    SET cashback_balance_cents = cashback_balance_cents - p_amount_cents,
        lifetime_cashback_spent_cents = lifetime_cashback_spent_cents + p_amount_cents, updated_at = now()
    WHERE id = w_id;
    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.withdraw_commission(
    p_user_id UUID, p_amount_cents INT, p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    w_id UUID; current_balance INT; tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN RAISE EXCEPTION 'Withdrawal amount must be positive'; END IF;
    SELECT id, commission_balance_cents INTO w_id, current_balance FROM public.cashback_wallets WHERE user_id = p_user_id FOR UPDATE;
    IF w_id IS NULL THEN RAISE EXCEPTION 'No wallet found for user'; END IF;
    IF current_balance < p_amount_cents THEN RAISE EXCEPTION 'Insufficient commission balance'; END IF;

    INSERT INTO public.cashback_transactions (wallet_id, user_id, type, amount_cents, metadata)
    VALUES (w_id, p_user_id, 'commission_withdrawal', -p_amount_cents, p_metadata) RETURNING id INTO tx_id;

    UPDATE public.cashback_wallets
    SET commission_balance_cents = commission_balance_cents - p_amount_cents,
        lifetime_commission_withdrawn_cents = lifetime_commission_withdrawn_cents + p_amount_cents, updated_at = now()
    WHERE id = w_id;
    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 6. Backfill users that don't have wallets ─────────────
INSERT INTO public.cashback_wallets (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.cashback_wallets)
ON CONFLICT (user_id) DO NOTHING;
