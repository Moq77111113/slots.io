import { DomainErrors } from '$domain/@shared/errors';

import type { AuthenticateUserArgs, PublicUser, UserServiceContext } from '../types';

export const UserAuthenticateSubService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		providers: { authProvider },
		shared: { errorHandler }
	} = context;

	const wrapPort = {
		authenticateWithCredentials: async (args: AuthenticateUserArgs) =>
			await authProvider.authenticateWithCredentials(args)
	};

	const authenticateWithCredentials = async (args: AuthenticateUserArgs): Promise<PublicUser> => {
		const { email, password } = args;
		const sanitizedEmail = email.trim().toLowerCase();
		const existingUser = await userRepository.findBy.email(sanitizedEmail);

		if (!existingUser) {
			throw errorHandler.throws(DomainErrors.User.not_found);
		}

		const id = await wrapPort
			.authenticateWithCredentials({ email: sanitizedEmail, password })
			.catch(() => {
				throw errorHandler.throws(DomainErrors.User.invalid_credentials);
			});

		return await userRepository.patch({
			id,
			lastLogin: new Date()
		});
	};

	return {
		authenticateWithCredentials
	};
};
