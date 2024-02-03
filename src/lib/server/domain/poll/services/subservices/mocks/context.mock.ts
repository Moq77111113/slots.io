import type { ErrorHandler } from '$domain/@shared/errors';

import type { PollServiceContext } from '../../types';
import { MockedMeApi } from './me.api.mock';
import { MockedPollRepository } from './poll.repository.mock';

export const MockedPollContext = (): PollServiceContext => {
	const meApi = MockedMeApi();
	const poll = MockedPollRepository();

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
			poll
		}
	};
};
