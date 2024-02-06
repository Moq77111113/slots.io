import type { HuddleCreateArgs } from '$domain/huddle/ports/spi';
import { type SbHuddle, type SupabaseInfrastructure } from '$infrastructure';
import { supabaseToDomain } from '$infrastructure/mappers';

export const SupabaseHuddleRepository = ({
	huddles
}: {
	huddles: SupabaseInfrastructure['huddles'];
}) => {
	const SLOT_SELECTION = '*, availabilities(*, user:profiles(*))' as const;
	const CREATOR_SELECTION = 'profiles!creator_id(*)' as const;
	const PARTICIPANT_SELECTION = 'huddle_participant(user:profiles(*))' as const;
	const DEFAULT_SELECTION =
		`*,  slots(${SLOT_SELECTION}), creator:${CREATOR_SELECTION}, huddle_participant:${PARTICIPANT_SELECTION}` as const;

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

	const findAll = async () => {
		const query = huddles
			.select(DEFAULT_SELECTION)
			.order('created_at', { ascending: false })
			// We have to provide the type here because the type inference for one-to-one relations is currently not working (returning array)
			.returns<SbHuddle[]>();

		const { data, error } = await query;

		if (error) {
			throw Error(error.message);
		}

		return data.map((_) => supabaseToDomain.huddle(_));
	};

	return {
		create,
		findAll
	};
};

export type SupabaseHuddleRepository = ReturnType<typeof SupabaseHuddleRepository>;
