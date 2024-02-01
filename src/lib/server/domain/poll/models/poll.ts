import { type Branded, make } from '$brand';
import type { Entity } from '$domain/@shared';
import type { UserId } from '$domain/user/models';

import type { Slot } from './slot';

export type PollId = Branded<string, 'PollId'>;

const assertPollId = (id: string): asserts id is PollId => {
	if (typeof id !== 'string') throw new Error('Invalid Poll id');
};

export const makePollId = (id: string) => make(id, assertPollId);

/**
 * @description Aggregate root entity representing an event with associated slots.
 */
export type Poll = Entity<
	PollId,
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
