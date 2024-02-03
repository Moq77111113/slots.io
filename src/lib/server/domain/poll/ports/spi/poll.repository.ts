import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput, Identity } from '$domain/@shared/types';
import type { Poll, PollId, Slot, SlotId } from '$domain/poll/models';

export type PollCreateArgs = Identity<Omit<CreateEntityInput<Poll>, 'slots' | 'participantIds'>>;
export type SlotAddArgs = CreateEntityInput<Slot>;

type PollQuery = {
	findById: (id: string) => MaybePromise<Poll | null>;
	findBySlotId: (slotId: SlotId) => MaybePromise<Poll | null>;
};

type PollCommand = {
	create: (args: PollCreateArgs) => MaybePromise<Poll>;
	addSlot: (pollId: PollId, slot: SlotAddArgs) => MaybePromise<Poll>;
	removeSlot: (pollId: PollId, slotId: SlotId) => MaybePromise<Poll>;
};

export type PollRepository = PollCommand & PollQuery;
