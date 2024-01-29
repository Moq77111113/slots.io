import { DomainErrors } from '$domain/@shared/errors';

import type { PublicUser, RegisterUserArgs, UserServiceContext } from '../types';

export const UserRegisterSubService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		providers: { authProvider },
		shared: { errorHandler }
	} = context;

	const register = async (args: RegisterUserArgs): Promise<PublicUser> => {
		const { email, password } = args;

		const sanitizedEmail = email.toLowerCase();
		const exists = await userRepository.findBy.email(sanitizedEmail);

		if (exists) {
			throw errorHandler.throws(DomainErrors.User.already_exists(sanitizedEmail));
		}

		const userId = await authProvider.registerWithCredentials({
			email: sanitizedEmail,
			password
		});

		return await userRepository.upsert({
			id: userId,
			email: sanitizedEmail,
			status: 'active',
			language: { code: 'fr' },
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: null,
			locale: 'fr_FR'
		});
	};

	return { register };
};
