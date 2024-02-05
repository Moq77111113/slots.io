import type { Availability } from '$domain/huddle/attributes';
import { type Huddle, makeHuddleId, makeSlotId, type Slot } from '$domain/huddle/models';
import { makeUserId } from '$domain/user/models';
import type { SbAvailability, SbHuddle, SbSlot } from '$infrastructure';
import {
	type AvailabilitySchema,
	availabilitySchema,
	huddleSchema,
	type SlotSchema,
	slotSchema
} from '$infrastructure/schemas/domain/huddle.schemas';
import {
	availabilitySchema as SbAvailabilitySchema,
	huddleSchema as SbHuddleSchema,
	slotSchema as SbSlotSchema
} from '$infrastructure/schemas/supabase/huddle.schemas';

import { validateData } from '../validate';
import { subabaseToDomain as toDomainUser } from './user.mapper';

const parseSbAvailability = (entity: SbAvailability): SbAvailability => {
	const [availability, error] = validateData<typeof SbAvailabilitySchema>(
		{
			...entity
		},
		SbAvailabilitySchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid availability data');
	}
	return availability;
};
const parseAvailability = ({
	user,
	...entity
}: ReturnType<typeof parseSbAvailability>): Availability => {
	const [availability, error] = validateData<AvailabilitySchema>(
		{
			...entity,
			userId: entity.user_id
		},
		availabilitySchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid availability data');
	}
	return {
		...availability,
		userId: makeUserId(availability.userId),
		user: user ? toDomainUser(user) : undefined
	};
};

const parseSbSlot = (entity: SbSlot): SbSlot => {
	const [slot, error] = validateData<typeof SbSlotSchema>(
		{
			...entity,
			availabilities: entity.availabilities.map(parseSbAvailability)
		},
		SbSlotSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid slot data');
	}
	return slot;
};

const parseSlot = (entity: ReturnType<typeof parseSbSlot>): Slot => {
	const [slot, error] = validateData<SlotSchema>(
		{
			...entity,
			id: entity.id,
			start: new Date(entity.start),
			end: new Date(entity.end),
			createdAt: new Date(entity.created_at),
			updatedAt: new Date(entity.updated_at),
			availabilities: entity.availabilities.map(parseAvailability)
		},
		slotSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid slot data');
	}

	return {
		...slot,
		id: makeSlotId(slot.id),
		availabilities: slot.availabilities.map((_) => ({
			..._,
			userId: makeUserId(_.userId),
			user: _.user ? { ..._.user, id: makeUserId(_.user.id) } : undefined
		}))
	};
};

const parseSbHuddle = (entity: SbHuddle): SbHuddle => {
	const [huddle, error] = validateData<typeof SbHuddleSchema>(
		{
			...entity,
			participantIds: [],
			participants: []
		},
		SbHuddleSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid huddle data');
	}
	return huddle;
};

const parseHuddle = (entity: SbHuddle): Huddle => {
	const [huddle, error] = validateData<typeof huddleSchema>(
		{
			...entity,
			createdAt: new Date(entity.created_at),
			updatedAt: new Date(entity.updated_at),
			participantIds: [],
			creatorId: entity.creator_id,
			creator: undefined,
			slots: [],
			participants: [],
			description: entity.description || undefined,
			expiration: entity.expiration ? new Date(entity.expiration) : undefined
		},
		huddleSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid huddle data');
	}
	return {
		...huddle,
		id: makeHuddleId(huddle.id),
		creatorId: makeUserId(huddle.creatorId),
		creator: entity.creator ? toDomainUser(entity.creator) : undefined,
		slots: entity.slots.map(parseSlot),
		participantIds: huddle.participantIds.map(makeUserId),
		participants: entity.participants?.map(toDomainUser)
	};
};
