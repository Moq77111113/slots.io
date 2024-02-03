import { type Branded, make } from '$brand';
import type { Entity } from '$domain/@shared';
import type { UserId } from '$domain/user/models';

import type { Slot } from './slot';

export type HuddleId = Branded<string, 'HuddleId'>;

const assertHuddleId = (id: string): asserts id is HuddleId => {
	if (typeof id !== 'string') throw new Error('Invalid Huddle id');
};

export const makeHuddleId = (id: string) => make(id, assertHuddleId);

/**
 * @description Aggregate root entity representing an event with associated slots.
 */
export type Huddle = Entity<
	HuddleId,
	{
		title: string;
		description?: string;
		creatorId: UserId;
		slots: Slot[];
		locked: boolean;
		expiration?: Date;
		participantIds: UserId[];
	}
>;
