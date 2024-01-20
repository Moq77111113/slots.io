import type { Branded } from '$brand';

export type Entity<ID extends Branded<unknown, string>, T> = { id: ID } & T & {
		createdAt: Date;
		updatedAt: Date;
	};
