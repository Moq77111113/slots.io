import type { HuddleId, SlotId } from '$domain/huddle/models';
import type { AvailabilityAddArgs, HuddleCreateArgs, SlotAddArgs } from '$domain/huddle/ports/spi';
import { type SbHuddle, type SupabaseInfrastructure } from '$infrastructure';
import { supabaseToDomain } from '$infrastructure/mappers';

export const SupabaseHuddleRepository = ({
	huddleResources
}: {
	huddleResources: SupabaseInfrastructure['huddleResources'];
}) => {
	const SLOT_SELECTION = '*, availabilities(*, user:profiles(*))' as const;
	const CREATOR_SELECTION = 'profiles!creator_id(*)' as const;
	const PARTICIPANT_SELECTION = 'huddle_participant(user:profiles(*))' as const;
	const DEFAULT_SELECTION =
		`*,  slots(${SLOT_SELECTION}), creator:${CREATOR_SELECTION}, huddle_participant:${PARTICIPANT_SELECTION}` as const;

	const { huddles, slots, availabilities } = huddleResources;
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
			.returns<SbHuddle[]>()
			.single();

		if (error) {
			throw Error(error.message);
		}
		return supabaseToDomain.huddle(data);
	};

	const findById = async (id: HuddleId) => {
		const { data, error } = await huddles
			.select(DEFAULT_SELECTION)
			.eq('id', id)
			.returns<SbHuddle[]>()
			.single();

		if (error) {
			return null;
		}

		return supabaseToDomain.huddle(data);
	};

	const findBySlotId = async (slotId: SlotId) => {
		const { data, error } = await huddles
			.select(DEFAULT_SELECTION)
			.eq('slots.id', slotId)
			.returns<SbHuddle[]>()
			.single();

		if (error) {
			return null;
		}

		return supabaseToDomain.huddle(data);
	};

	const addSlot = async (huddleId: HuddleId, slot: SlotAddArgs) => {
		const { data: slotData, error } = await slots
			.insert({
				huddle_id: huddleId,
				start: slot.start.toISOString(),
				end: slot.end.toISOString()
			})
			.select('id')
			.single();
		if (error) {
			throw Error(error.message);
		}
		const { error: availabiltyError } = await availabilities.insert(
			slot.availabilities.map((_) => ({
				status: _.status,
				user_id: _.userId,
				slot_id: slotData.id
			}))
		);
		if (availabiltyError) {
			throw Error(availabiltyError.message);
		}

		const huddle = await findById(huddleId);
		if (!huddle) {
			throw Error('Huddle not found');
		}
		return huddle;
	};

	const removeSlot = async (huddleId: HuddleId, slotId: SlotId) => {
		await slots.delete().eq('id', slotId).eq('huddle_id', huddleId);

		const huddle = await findById(huddleId);
		if (!huddle) {
			throw Error('Huddle not found');
		}
		return huddle;
	};

	const addAvailability = async (slotId: SlotId, availability: AvailabilityAddArgs) => {
		const { error } = await availabilities.insert({
			status: availability.status,
			user_id: availability.userId,
			slot_id: slotId
		});
		if (error) {
			throw Error(error.message);
		}

		const huddle = await findBySlotId(slotId);
		if (!huddle) {
			throw Error('Huddle not found');
		}
		return huddle;
	};

	const removeAvailability = async (slotId: SlotId, availability: AvailabilityAddArgs) => {
		const { error } = await availabilities
			.delete()
			.eq('slot_id', slotId)
			.eq('user_id', availability.userId);
		if (error) {
			throw Error(error.message);
		}

		const huddle = await findBySlotId(slotId);
		if (!huddle) {
			throw Error('Huddle not found');
		}
		return huddle;
	};
	return {
		create,
		findById,
		findBySlotId,
		addSlot,
		removeSlot,
		addAvailability,
		removeAvailability
	};
};

export type SupabaseHuddleRepository = ReturnType<typeof SupabaseHuddleRepository>;
