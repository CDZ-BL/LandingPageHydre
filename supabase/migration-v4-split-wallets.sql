-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V4.1 — Direct Cashback & Commission Wallets
-- Run this in Supabase Dashboard → SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── CASHBACK WALLETS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cashback_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    cashback_balance_cents INT NOT NULL DEFAULT 0 CHECK (cashback_balance_cents >= 0),
    lifetime_cashback_earned_cents INT NOT NULL DEFAULT 0 CHECK (lifetime_cashback_earned_cents >= 0),
    lifetime_cashback_spent_cents INT NOT NULL DEFAULT 0 CHECK (lifetime_cashback_spent_cents >= 0),
    commission_balance_cents INT NOT NULL DEFAULT 0 CHECK (commission_balance_cents >= 0),
    lifetime_commission_earned_cents INT NOT NULL DEFAULT 0 CHECK (lifetime_commission_earned_cents >= 0),
    lifetime_commission_withdrawn_cents INT NOT NULL DEFAULT 0 CHECK (lifetime_commission_withdrawn_cents >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cashback_wallets_user
    ON public.cashback_wallets(user_id);

ALTER TABLE public.cashback_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own wallet" ON public.cashback_wallets
    FOR SELECT USING (auth.uid() = user_id);

-- ── CASHBACK TRANSACTIONS ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cashback_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.cashback_wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'purchase_self_cashback',    
        'referral_cashback',         
        'redemption',                
        'commission_withdrawal'      
    )),
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

CREATE POLICY "Users read own cashback transactions" ON public.cashback_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- ── HELPER: Ensure wallet exists ────────────────────────────

CREATE OR REPLACE FUNCTION public.ensure_cashback_wallet(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    w_id UUID;
BEGIN
    SELECT id INTO w_id FROM public.cashback_wallets WHERE user_id = p_user_id;
    IF w_id IS NULL THEN
        INSERT INTO public.cashback_wallets (user_id)
        VALUES (p_user_id)
        ON CONFLICT (user_id) DO NOTHING
        RETURNING id INTO w_id;
        IF w_id IS NULL THEN
            SELECT id INTO w_id FROM public.cashback_wallets WHERE user_id = p_user_id;
        END IF;
    END IF;
    RETURN w_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── HELPER: Credit cashback ─────────────────────────────────

CREATE OR REPLACE FUNCTION public.credit_cashback(
    p_user_id UUID,
    p_amount_cents INT,
    p_type TEXT,
    p_source_order_id UUID DEFAULT NULL,
    p_related_user_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    w_id UUID;
    tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Credit amount must be positive';
    END IF;

    w_id := public.ensure_cashback_wallet(p_user_id);

    INSERT INTO public.cashback_transactions (
        wallet_id, user_id, type, amount_cents,
        source_order_id, related_user_id, metadata
    )
    VALUES (
        w_id, p_user_id, p_type, p_amount_cents,
        p_source_order_id, p_related_user_id, p_metadata
    )
    RETURNING id INTO tx_id;

    IF p_type = 'referral_cashback' THEN
        UPDATE public.cashback_wallets
        SET commission_balance_cents = commission_balance_cents + p_amount_cents,
            lifetime_commission_earned_cents = lifetime_commission_earned_cents + p_amount_cents,
            updated_at = now()
        WHERE id = w_id;
    ELSE
        UPDATE public.cashback_wallets
        SET cashback_balance_cents = cashback_balance_cents + p_amount_cents,
            lifetime_cashback_earned_cents = lifetime_cashback_earned_cents + p_amount_cents,
            updated_at = now()
        WHERE id = w_id;
    END IF;

    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── HELPER: Redeem cashback (store credit) ──────────────────

CREATE OR REPLACE FUNCTION public.redeem_cashback(
    p_user_id UUID,
    p_amount_cents INT,
    p_source_order_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    w_id UUID;
    current_balance INT;
    tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Redemption amount must be positive';
    END IF;

    SELECT id, cashback_balance_cents INTO w_id, current_balance
    FROM public.cashback_wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF w_id IS NULL THEN
        RAISE EXCEPTION 'No wallet found for user';
    END IF;

    IF current_balance < p_amount_cents THEN
        RAISE EXCEPTION 'Insufficient balance: % cents available, % requested',
            current_balance, p_amount_cents;
    END IF;

    INSERT INTO public.cashback_transactions (
        wallet_id, user_id, type, amount_cents,
        source_order_id, metadata
    )
    VALUES (
        w_id, p_user_id, 'redemption', -p_amount_cents,
        p_source_order_id, p_metadata
    )
    RETURNING id INTO tx_id;

    UPDATE public.cashback_wallets
    SET cashback_balance_cents = cashback_balance_cents - p_amount_cents,
        lifetime_cashback_spent_cents = lifetime_cashback_spent_cents + p_amount_cents,
        updated_at = now()
    WHERE id = w_id;

    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── HELPER: Withdraw commission ─────────────────────────

CREATE OR REPLACE FUNCTION public.withdraw_commission(
    p_user_id UUID,
    p_amount_cents INT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    w_id UUID;
    current_balance INT;
    tx_id UUID;
BEGIN
    IF p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Withdrawal amount must be positive';
    END IF;

    SELECT id, commission_balance_cents INTO w_id, current_balance
    FROM public.cashback_wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF w_id IS NULL THEN
        RAISE EXCEPTION 'No wallet found for user';
    END IF;

    IF current_balance < p_amount_cents THEN
        RAISE EXCEPTION 'Insufficient commission balance: % cents available, % requested',
            current_balance, p_amount_cents;
    END IF;

    INSERT INTO public.cashback_transactions (
        wallet_id, user_id, type, amount_cents, metadata
    )
    VALUES (
        w_id, p_user_id, 'commission_withdrawal', -p_amount_cents, p_metadata
    )
    RETURNING id INTO tx_id;

    UPDATE public.cashback_wallets
    SET commission_balance_cents = commission_balance_cents - p_amount_cents,
        lifetime_commission_withdrawn_cents = lifetime_commission_withdrawn_cents + p_amount_cents,
        updated_at = now()
    WHERE id = w_id;

    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── HELPER: Process purchase cashback ───────────────────────

CREATE OR REPLACE FUNCTION public.process_purchase_cashback(
    p_buyer_id UUID,
    p_order_id UUID,
    p_order_total_cents INT
)
RETURNS TABLE(buyer_cashback INT, referrer_cashback INT, referrer_id UUID) AS $$
DECLARE
    cashback_amount INT;
    ref_id UUID;
    buyer_cb INT := 0;
    referrer_cb INT := 0;
BEGIN
    cashback_amount := floor(p_order_total_cents * 0.05);

    IF cashback_amount > 0 THEN
        PERFORM public.credit_cashback(
            p_buyer_id,
            cashback_amount,
            'purchase_self_cashback',
            p_order_id,
            NULL,
            jsonb_build_object('order_total_cents', p_order_total_cents, 'rate', 0.05)
        );
        buyer_cb := cashback_amount;

        SELECT r.referrer_id INTO ref_id
        FROM public.referrals r
        WHERE r.referred_id = p_buyer_id;

        IF ref_id IS NOT NULL THEN
            PERFORM public.credit_cashback(
                ref_id,
                cashback_amount,
                'referral_cashback',
                p_order_id,
                p_buyer_id,
                jsonb_build_object('order_total_cents', p_order_total_cents, 'rate', 0.05)
            );
            referrer_cb := cashback_amount;
        END IF;
    END IF;

    RETURN QUERY SELECT buyer_cb, referrer_cb, ref_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── TRIGGER: Auto-create wallet on new user ─────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.cashback_wallets (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- ── BACKFILL: Create wallets for existing users ─────────────
INSERT INTO public.cashback_wallets (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.cashback_wallets)
ON CONFLICT (user_id) DO NOTHING;
