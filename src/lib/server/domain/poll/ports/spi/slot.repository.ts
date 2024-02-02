import type { CreateEntityInput, MaybePromise, Prettify } from '$domain/@shared/types';
import type { PollId, Slot, SlotId } from '$domain/poll/models';

export type SlotCreateArgs = Prettify<
	CreateEntityInput<Slot> & {
		pollId: PollId;
	}
>;

type SlotCommand = {
	create: (args: SlotCreateArgs) => MaybePromise<Slot>;
	remove: (args: SlotId) => MaybePromise<Slot>;
};

export type SlotRepository = SlotCommand;