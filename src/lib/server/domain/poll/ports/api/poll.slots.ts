import type { MaybePromise } from '$domain/@shared';
import type { Prettify } from '$domain/@shared/types';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { Poll, PollId, SlotId } from '$domain/poll/models';

export type PollSlotsApi = {
	add: (poll: PollId, args: Prettify<CreateSlotDto>) => MaybePromise<Poll>;
	remove: (poll: PollId, slotId: SlotId) => MaybePromise<Poll>;
};
