import type { Entity } from '$domain/@shared';
import { make, type Branded } from '$domain/@shared/utils/brand';
import type { UserId } from '$domain/user/models';

export type PersonId = Branded<string, 'ParticipantId'>;

function assertsPersonId(id: string): asserts id is PersonId {
	if (typeof id !== 'string') throw new Error('Invalid person id');
}

export const makePersonId = (id: string) => make(id, assertsPersonId);

export type Person = Entity<
	PersonId,
	{
		name: string;
		email: string;
		userId?: UserId;
	}
>;
