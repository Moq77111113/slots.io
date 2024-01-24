/* eslint-disable regex/invalid */

import type { ErrorHandler } from '$domain/@shared/errors';

import type { UserServiceContext } from '../types';
import { MockedAuthInfrastructure } from './auth.infrastructure.mock';
import { MockedUserRepository } from './user.repository.mock';

export const MockedUserServiceContext = (): UserServiceContext => {
	const errorHandler = {
		throws: (e) => {
			throw new Error(e.message);
		}
	} satisfies ErrorHandler;

	return {
		shared: {
			errorHandler
		},
		repositories: {
			userRepository: MockedUserRepository()
		},
		infrastructure: {
			authInfrastructure: MockedAuthInfrastructure()
		}
	};
};
