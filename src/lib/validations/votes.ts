/**
 * Vote Validation Schema
 * V4.0.0-HYDRE-APEX Compliant
 */

import { z } from 'zod';

export const CastVoteSchema = z.object({
    campaignId: z
        .string()
        .uuid('Invalid campaign ID'),
    selectedOption: z
        .string()
        .min(1, 'Option is required')
        .max(200),
});

export type CastVoteInput = z.infer<typeof CastVoteSchema>;
