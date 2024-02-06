import type { Availability } from '$domain/huddle/attributes';
import { type Huddle, makeSlotId, type Slot } from '$domain/huddle/models';
import { makeUserId } from '$domain/user/models';
import type { SbAvailability, SbHuddle, SbSlot } from '$infrastructure';
import {
	type AvailabilitySchema,
	availabilitySchema,
	huddleSchema,
	type SlotSchema,
	slotSchema
} from '$infrastructure/schemas/domain/huddle.schemas';

import { validateData } from '../validate';
import { supabaseToDomain as toUser } from './user.mapper';

const parseAvailability = ({ user, ...entity }: SbAvailability): Availability => {
	const [availability, error] = validateData<AvailabilitySchema>(
		{
			...entity,
			userId: entity.user_id,
			user: toUser(user)
		},
		availabilitySchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid availability data');
	}

	return availability;
};

const parseSlot = (entity: SbSlot): Slot => {
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

export const supabaseToDomain = (entity: SbHuddle): Huddle => {
	const [huddle, error] = validateData<typeof huddleSchema>(
		{
			...entity,
			createdAt: new Date(entity.created_at),
			updatedAt: new Date(entity.updated_at),
			participantIds: entity.huddle_participant.map((_) => _.user.id),
			creatorId: entity.creator_id,
			creator: toUser(entity.creator),
			slots: entity.slots.map(parseSlot),
			participants: entity.huddle_participant.map((_) => toUser(_.user)),
			description: entity.description || undefined,
			expiration: entity.expiration ? new Date(entity.expiration) : undefined
		},
		huddleSchema
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid huddle data');
	}
	return huddle;
};
