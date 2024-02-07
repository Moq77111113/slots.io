import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { CreateSlotDto } from '$domain/huddle/dto/in/slot.input';
import type { Huddle, HuddleId } from '$domain/huddle/models';

type AddSlotAction = Action<[HuddleId, CreateSlotDto], Promise<Huddle>>;
export const AddSlotAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.add-slot' as const;

	const execute = async (id: HuddleId, dto: CreateSlotDto) => {
		return await huddleApi.addSlot(id, dto);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<AddSlotAction, AppContext>;
