import { z } from 'zod';

const availability = z.union([
	z.literal('available'),
	z.literal('unavailable'),
	z.literal('maybe')
]);
export const slotAddSchema = z.object({
	start: z.date(),
	availability: availability.optional()
});

export const huddleCreateSchema = z.object({
	title: z
		.string()
		.min(2, 'Username must be at least 2 characters.')
		.max(30, 'Username must not be longer than 30 characters'),
	description: z.string().optional(),
	slots: slotAddSchema.array()
});

export type HuddleCreateSchema = typeof huddleCreateSchema;
