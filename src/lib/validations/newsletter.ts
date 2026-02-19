/**
 * Newsletter Validation Schema
 * V4.0.0-HYDRE-APEX Compliant
 */

import { z } from 'zod';

export const NewsletterSubscribeSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .min(5)
        .max(254)
        .transform((v) => v.toLowerCase().trim()),
});

export const NewsletterUnsubscribeSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .transform((v) => v.toLowerCase().trim()),
});

export type NewsletterSubscribeInput = z.infer<typeof NewsletterSubscribeSchema>;
export type NewsletterUnsubscribeInput = z.infer<typeof NewsletterUnsubscribeSchema>;
