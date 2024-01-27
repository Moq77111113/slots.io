import PocketBase, { type RecordModel } from 'pocketbase';

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

	return {
		healthCheck,
		auth: pocketbase.authStore,
		getCollection: <T, Name extends string = string>(name: Name) =>
			pocketbase.collection<T & RecordModel>(name)
	};
};

export type PocketBaseInfrastructure = Awaited<ReturnType<typeof PocketBaseInfrastructure>>;
