import type { Branded } from '$brand';

/**
 * @description An entity is a domain object that with mandatory fields.
 */
export type Entity<ID extends Branded<unknown, string>, T> = { id: ID } & T & {
		createdAt: Date;
		updatedAt: Date;
	};

/**
 * @description Identify allow to retrieve the body of an object.
 */
export type Identity<T> = {
	[P in keyof T]: T[P];
};

/**
 * @description Allow to get base dto to create an entity.
 */
export type CreateEntityInput<T> = Identity<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * @description Allow to get base dto to update an entity.
 */
export type UpdateEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Omit<T, 'createdAt' | 'updatedAt'>
>;

/**
 * @description Allow to get base dto to patch an entity.
 */
export type PatchEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	Omit<Partial<UpdateEntityInput<T>>, 'id'> & { id: T['id'] }
>;

/**
 * @description Allow to get base dto to upsert an entity.
 */
export type UpsertEntityInput<T extends Entity<Branded<unknown, string>, unknown>> = Identity<
	CreateEntityInput<T> & { id: T['id'] }
>;

/**
 * @description This type is used to prettify the types of objects.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
