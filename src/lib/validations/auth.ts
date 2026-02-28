/**
 * Auth Validation Schemas
 * V2.0.0-HYDRE — Signup, Login, Email Verification
 */

import { z } from 'zod';

// ── PASSWORD RULES ───────────────────────────────────────────
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

const passwordSchema = z
    .string()
    .min(PASSWORD_MIN, `Minimum ${PASSWORD_MIN} characters`)
    .max(PASSWORD_MAX, `Maximum ${PASSWORD_MAX} characters`)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number');

// ── SIGNUP ───────────────────────────────────────────────────

export const SignupSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(5)
        .max(254)
        .transform((v) => v.toLowerCase().trim()),
    password: passwordSchema,
    referralCode: z
        .string()
        .max(20)
        .optional()
        .transform((v) => v?.toUpperCase().trim()),
});

export type SignupInput = z.infer<typeof SignupSchema>;

// ── LOGIN ────────────────────────────────────────────────────

export const LoginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(5)
        .max(254)
        .transform((v) => v.toLowerCase().trim()),
    password: z.string().min(1, 'Password is required').max(PASSWORD_MAX),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ── VERIFY EMAIL ─────────────────────────────────────────────

export const VerifyEmailSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .transform((v) => v.toLowerCase().trim()),
    code: z
        .string()
        .length(6, 'Code must be exactly 6 digits')
        .regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

// ── RESEND CODE ──────────────────────────────────────────────

export const ResendCodeSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .transform((v) => v.toLowerCase().trim()),
});

export type ResendCodeInput = z.infer<typeof ResendCodeSchema>;
