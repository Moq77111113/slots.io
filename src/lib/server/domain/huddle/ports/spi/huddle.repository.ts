import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput, Identity } from '$domain/@shared/types';
import type { Availability } from '$domain/huddle/attributes';
import type { Huddle, HuddleId, Slot, SlotId } from '$domain/huddle/models';

export type HuddleCreateArgs = Identity<
	Omit<CreateEntityInput<Huddle>, 'slots' | 'participantIds' | 'creator' | 'participants'>
>;
export type SlotAddArgs = CreateEntityInput<Slot>;
export type AvailabilityAddArgs = Omit<Availability, 'user'>;
export type AvailabilityRemoveArgs = Pick<Availability, 'userId'>;

type HuddleQuery = {
	findById: (id: string) => MaybePromise<Huddle | null>;
	findBySlotId: (slotId: SlotId) => MaybePromise<Huddle | null>;
};

type HuddleCommand = {
	create: (args: HuddleCreateArgs) => MaybePromise<Huddle>;
	addSlot: (huddleId: HuddleId, slot: SlotAddArgs) => MaybePromise<Huddle>;
	removeSlot: (huddleId: HuddleId, slotId: SlotId) => MaybePromise<Huddle>;
	addAvailability: (slotId: SlotId, availability: AvailabilityAddArgs) => MaybePromise<Huddle>;
	removeAvailability: (
		slotId: SlotId,
		availability: AvailabilityRemoveArgs
	) => MaybePromise<Huddle>;
};

export type HuddleRepository = HuddleCommand & HuddleQuery;
