import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { CreateHuddleDto } from '$domain/huddle/dto/in/huddle.input';
import type { Huddle } from '$domain/huddle/models';

type CreateHuddleAction = Action<[CreateHuddleDto], Promise<Huddle>>;
export const CreateHuddleAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.create' as const;

	const execute = async (dto: CreateHuddleDto) => {
		return await huddleApi.create(dto);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<CreateHuddleAction, AppContext>;
