import type { Branded } from '$brand';
import type { Entity } from '$domain/@shared';
import type { UserId } from '$domain/user/models';

import type { Slot } from './slot';

export type PollId = Branded<string, 'PollId'>;

/**
 * @description Aggregate root entity representing an event with associated slots.
 */
export type Poll = Entity<
	PollId,
	{
		title: string;
		description?: string;
		creatorId: UserId; // TODO replace by userId;
		slots: Slot[];
		locked: boolean;
		expiration?: Date;
		participantIds: UserId[];
	}
>;
