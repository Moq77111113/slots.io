import type { MaybePromise } from '$domain/@shared/types/promise';
import type { Paginated, Entity as BaseEntity } from '$domain/@shared/types';
import type { Branded } from '$brand';
export interface Repository<
	Entity extends BaseEntity<Branded<unknown, string>, unknown>,
	EntityInput,
	EntityFilters
> {
	findOne(id: Entity['id']): MaybePromise<Entity | null>;
	findAll(filters?: EntityFilters): MaybePromise<Paginated<Entity>>;
	create(entity: EntityInput): MaybePromise<Entity>;
	update(id: Entity['id'], entity: EntityInput): MaybePromise<Entity>;
	patch(id: Entity['id'], entity: Partial<EntityInput>): MaybePromise<Entity>;
	remove(id: Entity['id']): MaybePromise<Entity>;
}
