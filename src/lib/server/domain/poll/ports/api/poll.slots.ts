import type { MaybePromise } from '$domain/@shared';
import type { Prettify } from '$domain/@shared/types';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { Poll, PollId, SlotId } from '$domain/poll/models';

export type SlotApi = {
	addSlot: (poll: PollId, args: Prettify<CreateSlotDto>) => MaybePromise<Poll>;
	removeSlot: (poll: PollId, slotId: SlotId) => MaybePromise<Poll>;
};
