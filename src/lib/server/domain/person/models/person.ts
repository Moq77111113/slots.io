import type { Entity } from '$domain/@shared';
import { make, type Branded } from '$domain/@shared/utils/brand';
import type { UserId } from '$domain/user/models';

export type PersonId = Branded<string, 'ParticipantId'>;

const assertsPersonId = (id: string): asserts id is PersonId => {
	if (typeof id !== 'string') throw new Error('Invalid person id');
};

export const makePersonId = (id: string) => make(id, assertsPersonId);

/**
 * @description Aggregate root entity representing a person.
 */
export type Person = Entity<
	PersonId,
	{
		name: string;
		email: string;
		userId?: UserId;
	}
>;
