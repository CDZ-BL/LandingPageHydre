/**
 * Waitlist Validation Schema
 * V4.0.0-HYDRE-APEX Compliant
 */

import { z } from 'zod';

export const WaitlistSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(5)
        .max(254)
        .transform((v) => v.toLowerCase().trim()),
    source: z
        .string()
        .max(50)
        .optional()
        .default('landing'),
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;
