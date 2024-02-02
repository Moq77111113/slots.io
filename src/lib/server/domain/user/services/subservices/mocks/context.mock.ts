/* eslint-disable regex/invalid */

import type { ErrorHandler } from '$domain/@shared/errors';

import type { UserServiceContext } from '../../types';
import { MockedAuthProvider } from './auth.provider.mock';
import { MockedUserRepository } from './user.repository.mock';

export const MockedUserServiceContext = (): UserServiceContext => {
	const errorHandler = {
		throws: (e) => {
			throw Error(e.key);
		}
	} satisfies ErrorHandler;

	return {
		shared: {
			errorHandler
		},
		repositories: {
			userRepository: MockedUserRepository()
		},
		providers: {
			authProvider: MockedAuthProvider()
		}
	};
};
