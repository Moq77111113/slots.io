import type { BaseSystemFields, Collections } from '$infrastructure/pocketbase/pb-types';

import type { PocketBaseInfrastructure } from './pocketbase';

export const makePocketBaseRepository = <Shape extends BaseSystemFields<unknown>>(
	{ pocketbase }: { pocketbase: PocketBaseInfrastructure },

	{ collection }: { collection: Collections }
) => {
	const { getCollection } = pocketbase;
	const repository = getCollection<Shape>(collection);

	return { repository };
};
