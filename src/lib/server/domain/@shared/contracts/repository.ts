import type { MaybePromise } from '$domain/@shared/types/promise';
import type { Paginated, BaseEntity } from '$domain/@shared/types';

export interface Repository<Entity extends BaseEntity, EntityInput, EntityFilters> {
	findOne(id: string): MaybePromise<Entity | null>;
	findAll(filters?: EntityFilters): MaybePromise<Paginated<Entity>>;
	create(entity: EntityInput): MaybePromise<Entity>;
	update(id: string, entity: EntityInput): MaybePromise<Entity>;
	patch(id: string, entity: Partial<EntityInput>): MaybePromise<Entity>;
	remove(id: string): MaybePromise<Entity>;
}
