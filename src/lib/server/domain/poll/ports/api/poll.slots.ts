import type { MaybePromise } from '$domain/@shared';
import type { Identity } from '$domain/@shared/types';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { Poll, PollId, SlotId } from '$domain/poll/models';

export type SlotApi = {
	addSlot: (poll: PollId, args: Identity<CreateSlotDto>) => MaybePromise<Poll>;
	removeSlot: (poll: PollId, slotId: SlotId) => MaybePromise<Poll>;
};
