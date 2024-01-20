import type { Entity } from '$domain/@shared';
import type { Branded } from '$brand';
import type { Slot } from './slot';

export type EventId = Branded<string, 'EventId'>;
/**
 * @description Aggregate root entity representing an event with associated slots.
 */
export type Event = Entity<
	EventId,
	{
		title: string;
		description?: string;
		creatorId: unknown; // TODO replace by userId;
		slots: Slot[];
		locked: boolean;
		expiration?: Date;
		participantIds: unknown[]; // TODO replace by userId;
	}
>;
