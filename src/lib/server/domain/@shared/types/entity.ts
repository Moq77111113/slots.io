import type { Branded } from '$brand';

export type Entity<ID extends Branded<unknown, string>, T> = { id: ID } & T & {
		createdAt: Date;
		updatedAt: Date;
	};

export type Identity<T> = {
	[P in keyof T]: T[P];
};
export type CreateEntityInput<T> = Identity<
	Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

export type UpdateEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	CreateEntityInput<T>
>;

export type PatchEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Partial<CreateEntityInput<T>>
>;
