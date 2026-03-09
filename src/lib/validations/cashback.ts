/**
 * Cashback Validation Schemas
 * V5.0.0-HYDRE-CASHBACK Compliant
 *
 * Schemas for cashback processing, redemption, and wallet queries.
 * All monetary values in cents (integer precision).
 */

import { z } from 'zod';

// ── Process Purchase Cashback (internal endpoint) ────────────
export const ProcessPurchaseCashbackSchema = z.object({
    buyer_id: z
        .string()
        .uuid('Invalid buyer ID format'),
    order_id: z
        .string()
        .uuid('Invalid order ID format'),
    order_total_cents: z
        .number()
        .int('Amount must be an integer (cents)')
        .min(1, 'Order total must be at least 1 cent')
        .max(100_000_000, 'Order total exceeds maximum'), // €1M max
});

export type ProcessPurchaseCashbackInput = z.infer<typeof ProcessPurchaseCashbackSchema>;

// ── Redeem Cashback ─────────────────────────────────────────
export const RedeemCashbackSchema = z.object({
    amount_cents: z
        .number()
        .int('Amount must be an integer (cents)')
        .min(1, 'Redemption must be at least 1 cent')
        .max(100_000_000, 'Redemption exceeds maximum'),
    order_id: z
        .string()
        .uuid('Invalid order ID format'),
});

export type RedeemCashbackInput = z.infer<typeof RedeemCashbackSchema>;

// ── Wallet Query Params ─────────────────────────────────────
export const WalletQuerySchema = z.object({
    limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(50),
    offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),
});

export type WalletQueryInput = z.infer<typeof WalletQuerySchema>;
