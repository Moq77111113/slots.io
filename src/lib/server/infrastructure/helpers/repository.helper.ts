import type { BaseSystemFields, Collections } from '$infrastructure/generated/pb-types';
import type { PocketbaseInfrastructure } from '$infrastructure/persistence/pocketbase';

export const makePocketBaseRepository = <Shape extends BaseSystemFields<unknown>>(
	{ pocketbase }: { pocketbase: PocketbaseInfrastructure },

	{ collection }: { collection: Collections }
) => {
	const { getCollection } = pocketbase;
	const repository = getCollection<Shape>(collection);

	return { repository };
};
