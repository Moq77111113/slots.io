import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { Huddle, SlotId } from '$domain/huddle/models';

type SetAvailabilityAction = Action<[SlotId], Promise<Huddle>>;
export const SetAvailableAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.set-available' as const;

	const execute = async (id: SlotId) => {
		return await huddleApi.setAvailable(id);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<SetAvailabilityAction, AppContext>;

export const SetUnAvailableAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.set-unavailable' as const;

	const execute = async (id: SlotId) => {
		return await huddleApi.setUnavailable(id);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<SetAvailabilityAction, AppContext>;

export const SetMaybeAvailableAction = ((context) => {
	const { huddleApi } = context.apis;
	const _name = 'huddle.set-maybe' as const;

	const execute = async (id: SlotId) => {
		return await huddleApi.setMaybeAvailable(id);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<SetAvailabilityAction, AppContext>;
