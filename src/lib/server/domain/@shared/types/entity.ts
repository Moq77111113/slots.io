import type { Branded } from '$brand';

export type Entity<ID extends Branded<unknown, string>, T> = { id: ID } & T & {
		createdAt: Date;
		updatedAt: Date;
	};

export type Identity<T> = {
	[P in keyof T]: T[P];
};
export type CreateEntityInput<T> = Identity<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Omit<T, 'createdAt' | 'updatedAt'>
>;
export type PatchEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Omit<Partial<UpdateEntityInput<T>>, 'id'> & { id: T['id'] }
>;
export type UpsertEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Omit<UpdateEntityInput<T>, 'id'> & { id?: T['id'] }
>;
