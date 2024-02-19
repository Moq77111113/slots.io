import type { Entity } from '#/domain/@shared';
import { type Branded, make } from '#/domain/@shared/utils/brand';
import type { Availability } from '#/domain/huddle/attributes';

export type SlotId = Branded<string, 'SlotId'>;

const assertSlotId = (id: unknown): asserts id is SlotId => {
	if (typeof id !== 'string') throw new Error('Invalid Slot id');
};

export const makeSlotId = (id: unknown) => make(id, assertSlotId);

/**
 * Represents a time slot associated with a huddle.
 */
export type Slot = Entity<
	SlotId,
	{
		start: Date;
		end: Date;
		availabilities: Availability[];
	}
>;
