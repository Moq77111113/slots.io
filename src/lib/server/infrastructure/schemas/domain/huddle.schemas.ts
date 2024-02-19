import { z } from 'zod';

import { type HuddleId, makeHuddleId, makeSlotId, type SlotId } from '#/domain/huddle/models';

import { userSchema } from './user.schemas';

const AvailabilityStatus = z.union([
	z.literal('available'),
	z.literal('unavailable'),
	z.literal('maybe')
]);
const availabilitySchema = z.object({
	userId: userSchema.shape.id,
	user: userSchema,
	status: AvailabilityStatus
});

const SlotIdSchema = z.custom<SlotId>(makeSlotId);
const slotSchema = z.object({
	id: SlotIdSchema,
	start: z.date(),
	end: z.date(),
	availabilities: z.array(availabilitySchema).default([]),
	createdAt: z.date(),
	updatedAt: z.date()
});

const HuddleIdSchema = z.custom<HuddleId>(makeHuddleId);
const huddleSchema = z.object({
	id: HuddleIdSchema,
	title: z.string(),
	description: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	creatorId: userSchema.shape.id,
	creator: userSchema,
	slots: z.array(slotSchema).default([]),
	locked: z.boolean(),
	expiration: z.date().optional(),
	participantIds: z.array(userSchema.shape.id).default([]),
	participants: z.array(userSchema).default([])
});

export { availabilitySchema, slotSchema, huddleSchema };
type HuddleSchema = typeof huddleSchema;
type SlotSchema = typeof slotSchema;
type AvailabilitySchema = typeof availabilitySchema;
export type { HuddleSchema, SlotSchema, AvailabilitySchema };
