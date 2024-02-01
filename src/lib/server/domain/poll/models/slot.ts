import type { Entity } from '$domain/@shared';
import { type Branded, make } from '$domain/@shared/utils/brand';
import type { Availability } from '$domain/poll/attributes';

export type SlotId = Branded<string, 'SlotId'>;

const assertSlotId = (id: string): asserts id is SlotId => {
	if (typeof id !== 'string') throw new Error('Invalid Poll id');
};

export const makeSlotId = (id: string) => make(id, assertSlotId);

/**
 * Represents a time slot associated with a poll.
 */
export type Slot = Entity<
	SlotId,
	{
		start: Date;
		end: Date;
		availabilities: Availability[];
	}
>;
