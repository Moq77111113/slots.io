import type { Entity } from '$domain/@shared';
import type { Availability } from '$domain/event/attributes';

/**
 * Represents a time slot associated with an event.
 */
export type Slot = Entity<{
	start: Date;
	end: Date;
	availabilities: Availability[];
}>;
