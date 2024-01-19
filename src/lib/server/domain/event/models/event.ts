import type { Entity } from '$domain/@shared';
import type { Slot } from './slot';

/**
 * @description Aggregate root entity representing an event with associated slots.
 */
export type Event = Entity<{
	title: string;
	description?: string;
	creator: unknown; // TODO replace by user;
	slots: Slot[];
	locked: boolean;
	expiration?: Date;
	participants: unknown[]; // TODO replace by user;
}>;
