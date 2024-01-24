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
		const exists = await userRepository.findBy.email(args.email);

		if (exists) {
			throw errorHandler.throws(DomainErrors.User.already_exists(email));
		}

		const salt = await authInfrastructure.hash.generateSalt();
		const hashedPassword = await authInfrastructure.hash.hashPassword({ password, salt });

		const createdUser = await userRepository.create({
			email,
			password: hashedPassword,
			salt,
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
