import type { Entity } from '$domain/@shared';
import type { Branded } from '$domain/@shared/utils/brand';
import type { Availability } from '$domain/poll/attributes';

export type SlotId = Branded<string, 'SlotId'>;
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
