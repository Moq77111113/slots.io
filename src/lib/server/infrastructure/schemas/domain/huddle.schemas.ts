import { z } from 'zod';

import { userSchema } from './user.schemas';

const AvailabilityStatus = z.union([
	z.literal('available'),
	z.literal('unavailable'),
	z.literal('maybe')
]);

const availabilitySchema = z.object({
	userId: z.string(),
	user: userSchema.optional(),
	status: AvailabilityStatus
});

const slotSchema = z.object({
	id: z.string(),
	start: z.date(),
	end: z.date(),
	availabilities: z.array(availabilitySchema).default([]),
	createdAt: z.date(),
	updatedAt: z.date()
});

const huddleSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	creatorId: z.string(),
	creator: userSchema.optional(),
	slots: z.array(slotSchema).default([]),
	locked: z.boolean(),
	expiration: z.date().optional(),
	participantIds: z.array(z.string()).default([]),
	participants: z.array(userSchema).default([])
});

export { availabilitySchema, slotSchema, huddleSchema };
type HuddleSchema = typeof huddleSchema;
type SlotSchema = typeof slotSchema;
type AvailabilitySchema = typeof availabilitySchema;
export type { HuddleSchema, SlotSchema, AvailabilitySchema };
