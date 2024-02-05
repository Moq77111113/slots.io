import { type Huddle, makeHuddleId, makeSlotId } from '$domain/huddle/models';
import type { HuddleCreateArgs } from '$domain/huddle/ports/spi';
import { makeUserId } from '$domain/user/models';
import {
	DomainSchemas,
	type SbHuddle,
	type SupabaseInfrastructure,
	validateData
} from '$infrastructure';

const toHuddle = (entity: SbHuddle): Huddle => {
	const [huddle, error] = validateData<DomainSchemas['Huddle']>(
		{
			...entity,
			description: entity.description || undefined,
			creatorId: entity.creator_id,
			createdAt: new Date(entity.created_at),
			updatedAt: new Date(entity.updated_at || entity.created_at),
			participantIds: [],
			participants: entity.participants,
			expiration: entity.expiration ? new Date(entity.expiration) : undefined,
			slots: entity.slots.map((slot) => ({
				...slot,
				start: new Date(slot.start),
				end: new Date(slot.end),
				createdAt: new Date(slot.created_at),
				updatedAt: new Date(slot.updated_at),
				availabilities: slot.availabilities.map((availability) => ({
					...availability,
					userId: availability.user_id,
					user: availability.user
				}))
			}))
		},
		DomainSchemas.Huddle
	);

	if (error) {
		throw Error(error.formErrors[0] || 'Invalid user data');
	}
	return {
		...huddle,
		id: makeHuddleId(huddle.id),
		creatorId: makeUserId(huddle.creatorId),
		participantIds: huddle.participantIds.map(makeUserId),
		slots: huddle.slots.map((slot) => ({
			...slot,
			id: makeSlotId(slot.id),
			availabilities: slot.availabilities.map((availability) => ({
				...availability,
				userId: makeUserId(availability.userId)
			}))
		}))
	};
};
export const SupabaseHuddleRepository = ({
	huddles
}: {
	huddles: SupabaseInfrastructure['huddles'];
}) => {
	const SLOT_SELECTION = '*, availabilities(*, user:profiles!user_id(*))' as const;
	const CREATOR_SELECTION = 'profiles!creator_id(*)' as const;
	const PARTICIPANT_SELECTION = 'huddle_participant (user:profiles(*))' as const;
	const DEFAULT_SELECTION =
		`*,  slots(${SLOT_SELECTION}), creator:${CREATOR_SELECTION}, participants:${PARTICIPANT_SELECTION}` as const;

	const create = async (args: HuddleCreateArgs) => {
		const { creatorId, description, title, locked, expiration } = args;
		const { data, error } = await huddles
			.insert({
				creator_id: creatorId,
				description,
				title,
				locked,
				expiration: expiration?.toISOString()
			})
			.select(DEFAULT_SELECTION)
			.single();

		if (error) {
			console.log(error.message);
			throw Error(error.message);
		}
		return toHuddle(data);
	};

	const findAll = async () => {
		const query = huddles.select(DEFAULT_SELECTION).order('created_at', { ascending: false });

		const { data, error } = await query;

		if (error) {
			throw Error(error.message);
		}

		return data; //.map(toHuddle);
	};

	return {
		create,
		findAll
	};
};

export type SupabaseHuddleRepository = ReturnType<typeof SupabaseHuddleRepository>;
