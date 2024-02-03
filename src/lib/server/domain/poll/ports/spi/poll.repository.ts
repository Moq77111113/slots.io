import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput, Identity } from '$domain/@shared/types';
import type { Availability } from '$domain/poll/attributes';
import type { Poll, PollId, Slot, SlotId } from '$domain/poll/models';

export type PollCreateArgs = Identity<Omit<CreateEntityInput<Poll>, 'slots' | 'participantIds'>>;
export type SlotAddArgs = CreateEntityInput<Slot>;
export type AvailabilityAddArgs = Availability;
export type AvailabilityRemoveArgs = Pick<Availability, 'userId'>;

type PollQuery = {
	findById: (id: string) => MaybePromise<Poll | null>;
	findBySlotId: (slotId: SlotId) => MaybePromise<Poll | null>;
};

type PollCommand = {
	create: (args: PollCreateArgs) => MaybePromise<Poll>;
	addSlot: (pollId: PollId, slot: SlotAddArgs) => MaybePromise<Poll>;
	removeSlot: (pollId: PollId, slotId: SlotId) => MaybePromise<Poll>;
	addAvailability: (slotId: SlotId, availability: AvailabilityAddArgs) => MaybePromise<Poll>;
	removeAvailability: (slotId: SlotId, availability: AvailabilityRemoveArgs) => MaybePromise<Poll>;
};

export type PollRepository = PollCommand & PollQuery;
