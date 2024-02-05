import { z } from 'zod';

import { supabaseUserSchema } from './user.schemas';

const AvailabilityStatus = z.union([
	z.literal('available'),
	z.literal('unavailable'),
	z.literal('maybe')
]);

const availabilitySchema = z.object({
	slot_id: z.string(),
	user_id: z.string(),
	user: supabaseUserSchema.optional(),
	status: AvailabilityStatus
});

const slotSchema = z.object({
	id: z.string(),
	start: z.string(),
	end: z.string(),
	availabilities: z.array(availabilitySchema).default([]),
	created_at: z.string(),
	updated_at: z.string(),
	huddle_id: z.string()
});

const huddleSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	creator_id: z.string(),
	creator: supabaseUserSchema.optional(),
	slots: z.array(slotSchema).default([]),
	locked: z.boolean(),
	expiration: z.string().nullable(),
	participantIds: z.array(z.string()).default([]),
	participants: z.array(supabaseUserSchema).default([])
});

export { availabilitySchema, slotSchema, huddleSchema };
