import type { ErrorHandler } from '$domain/@shared/errors';

import type { HuddleServiceContext } from '../../types';
import { MockedMeApi } from './me.api.mock';
import { MockedHuddleRepository } from './huddle.repository.mock';

export const MockedHuddleContext = (): HuddleServiceContext => {
	const meApi = MockedMeApi();
	const huddle = MockedHuddleRepository();

	const errorHandler = {
		throws: (e) => {
			throw Error(e.key);
		}
	} satisfies ErrorHandler;

	return {
		shared: {
			errorHandler
		},
		apis: {
			meApi
		},
		repositories: {
			huddle
		}
	};
};
