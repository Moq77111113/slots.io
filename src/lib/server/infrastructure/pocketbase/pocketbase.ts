import PocketBase from 'pocketbase';

import { Collections } from '.';
import type { PocketBaseEntities } from './types';

type PocketBaseInfrastructureContext = {
	uri: string;
};
export const PocketBaseInfrastructure = async (context: PocketBaseInfrastructureContext) => {
	const { uri } = context;
	const pocketbase = new PocketBase(uri);

	const healthCheck = async () => {
		try {
			const health = await pocketbase.health.check();
			return health.code === 200;
		} catch {
			return false;
		}
	};

	const isUp = await healthCheck();
	if (!isUp) {
		console.error(`Unable to connect to PocketBase at ${uri}, exiting...`);
		process.exit(1);
	}

	const userCollection = pocketbase.collection<PocketBaseEntities['User']>(Collections.Users);
	return {
		healthCheck,
		auth: pocketbase.authStore,
		collections: {
			users: userCollection
		}
	};
};

export type PocketBaseInfrastructure = Awaited<ReturnType<typeof PocketBaseInfrastructure>>;
