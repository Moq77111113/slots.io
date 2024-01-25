import { DomainErrors } from '$domain/@shared/errors';

import type { PublicUser, RegisterUserArgs, UserServiceContext } from '../types';

export const UserRegisterSubService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		infrastructure: { authInfrastructure },
		shared: { errorHandler }
	} = context;

	const register = async (args: RegisterUserArgs): Promise<PublicUser> => {
		const { email, password } = args;

		const sanitizedEmail = email.toLowerCase();
		const exists = await userRepository.findBy.email(sanitizedEmail);

		if (exists) {
			throw errorHandler.throws(DomainErrors.User.already_exists(sanitizedEmail));
		}

		const userId = await authInfrastructure.registerWithCredentials({
			email: sanitizedEmail,
			password
		});

		const createdUser = await userRepository.upsert({
			id: userId,
			email: sanitizedEmail,
			password,
			status: 'active',
			language: { code: 'fr' },
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: null,
			locale: 'fr_FR'
		});
		const { password: _, salt: __, ...publicUser } = createdUser;
		return publicUser;
	};

	return { register };
};
