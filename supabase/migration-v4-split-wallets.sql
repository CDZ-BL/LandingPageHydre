-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HYDRE V4.0 — Split Cashback & Commission Wallets
-- Run this in Supabase Dashboard → SQL Editor
-- Requires: migration-v3-cashback.sql already applied
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ── 1. RENAME existing columns → cashback-specific ──────────
-- Old balance_cents becomes cashback_balance_cents (store credit only)

ALTER TABLE public.cashback_wallets
    RENAME COLUMN balance_cents TO cashback_balance_cents;

ALTER TABLE public.cashback_wallets
    RENAME COLUMN lifetime_earned_cents TO lifetime_cashback_earned_cents;

ALTER TABLE public.cashback_wallets
    RENAME COLUMN lifetime_spent_cents TO lifetime_cashback_spent_cents;

-- ── 2. ADD commission columns ───────────────────────────────
-- Commission = money earned from referred users' purchases (withdrawable)

ALTER TABLE public.cashback_wallets
    ADD COLUMN IF NOT EXISTS commission_balance_cents INT NOT NULL DEFAULT 0
        CHECK (commission_balance_cents >= 0);

ALTER TABLE public.cashback_wallets
    ADD COLUMN IF NOT EXISTS lifetime_commission_earned_cents INT NOT NULL DEFAULT 0
        CHECK (lifetime_commission_earned_cents >= 0);

ALTER TABLE public.cashback_wallets
    ADD COLUMN IF NOT EXISTS lifetime_commission_withdrawn_cents INT NOT NULL DEFAULT 0
        CHECK (lifetime_commission_withdrawn_cents >= 0);

-- ── 3. ADD withdrawal transaction type ──────────────────────

ALTER TABLE public.cashback_transactions
    DROP CONSTRAINT IF EXISTS cashback_transactions_type_check;

ALTER TABLE public.cashback_transactions
    ADD CONSTRAINT cashback_transactions_type_check
    CHECK (type IN (
        'purchase_self_cashback',    -- 5% cashback on own purchase (store credit)
        'referral_cashback',         -- 5% commission from referred user's purchase (withdrawable)
        'redemption',                -- Store credit used on purchase (cashback only)
        'commission_withdrawal'      -- Commission withdrawn to bank account
    ));

-- ── 4. BACKFILL: Move existing referral_cashback to commission ─
-- Any existing referral_cashback transactions should update
-- the commission_balance instead of cashback_balance.

DO $$
DECLARE
    w RECORD;
    referral_total INT;
BEGIN
    FOR w IN SELECT id, user_id FROM public.cashback_wallets LOOP
        -- Sum all referral_cashback credits for this user
        SELECT COALESCE(SUM(amount_cents), 0) INTO referral_total
        FROM public.cashback_transactions
        WHERE user_id = w.user_id AND type = 'referral_cashback' AND amount_cents > 0;

        IF referral_total > 0 THEN
            -- Move from cashback to commission
            UPDATE public.cashback_wallets
            SET cashback_balance_cents = GREATEST(cashback_balance_cents - referral_total, 0),
                lifetime_cashback_earned_cents = GREATEST(lifetime_cashback_earned_cents - referral_total, 0),
                commission_balance_cents = referral_total,
                lifetime_commission_earned_cents = referral_total
            WHERE id = w.id;
        END IF;
    END LOOP;
END;
$$;

-- ── 5. UPDATE credit_cashback RPC ───────────────────────────
-- Routes credits to the correct balance based on transaction type.

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
    -- Validate
    IF p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Credit amount must be positive';
    END IF;

    -- Ensure wallet exists
    w_id := public.ensure_cashback_wallet(p_user_id);

    -- Insert transaction
    INSERT INTO public.cashback_transactions (
        wallet_id, user_id, type, amount_cents,
        source_order_id, related_user_id, metadata
    )
    VALUES (
        w_id, p_user_id, p_type, p_amount_cents,
        p_source_order_id, p_related_user_id, p_metadata
    )
    RETURNING id INTO tx_id;

    -- Route to correct balance
    IF p_type = 'referral_cashback' THEN
        -- Commission: withdrawable money
        UPDATE public.cashback_wallets
        SET commission_balance_cents = commission_balance_cents + p_amount_cents,
            lifetime_commission_earned_cents = lifetime_commission_earned_cents + p_amount_cents,
            updated_at = now()
        WHERE id = w_id;
    ELSE
        -- Cashback: store credit only
        UPDATE public.cashback_wallets
        SET cashback_balance_cents = cashback_balance_cents + p_amount_cents,
            lifetime_cashback_earned_cents = lifetime_cashback_earned_cents + p_amount_cents,
            updated_at = now()
        WHERE id = w_id;
    END IF;

    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 6. UPDATE redeem_cashback RPC ───────────────────────────
-- Only deducts from cashback_balance_cents (store credit).

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
    -- Validate
    IF p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Redemption amount must be positive';
    END IF;

    -- Get wallet with lock
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

    -- Insert negative transaction
    INSERT INTO public.cashback_transactions (
        wallet_id, user_id, type, amount_cents,
        source_order_id, metadata
    )
    VALUES (
        w_id, p_user_id, 'redemption', -p_amount_cents,
        p_source_order_id, p_metadata
    )
    RETURNING id INTO tx_id;

    -- Debit cashback wallet atomically
    UPDATE public.cashback_wallets
    SET cashback_balance_cents = cashback_balance_cents - p_amount_cents,
        lifetime_cashback_spent_cents = lifetime_cashback_spent_cents + p_amount_cents,
        updated_at = now()
    WHERE id = w_id;

    RETURN tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 7. NEW: Withdraw commission RPC ─────────────────────────
-- Deducts from commission_balance_cents (real money withdrawal).

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
