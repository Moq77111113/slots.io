import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { Huddle, HuddleId, SlotId } from '$domain/huddle/models';

type RemoveSlotAction = Action<[HuddleId, SlotId], Promise<Huddle>>;
export const RemoveSlotAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.remove-slot' as const;

	const execute = async (id: HuddleId, slotId: SlotId) => {
		return await huddleApi.removeSlot(id, slotId);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<RemoveSlotAction, AppContext>;
