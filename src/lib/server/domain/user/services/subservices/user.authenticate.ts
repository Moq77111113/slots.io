import { DomainErrors } from '$domain/@shared/errors';

import type { AuthenticateUserArgs, PublicUser, UserServiceContext } from '../types';

export const UserAuthenticateSubService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		infrastructure: { authInfrastructure },
		shared: { errorHandler }
	} = context;

	const authenticateWithCredentials = async (args: AuthenticateUserArgs): Promise<PublicUser> => {
		const { email, password } = args;
		const sanitizedEmail = email.trim().toLowerCase();
		const existingUser = await userRepository.findBy.email(sanitizedEmail);

		if (!existingUser) {
			throw errorHandler.throws(DomainErrors.User.not_found);
		}

		if (!existingUser.password) {
			throw errorHandler.throws(DomainErrors.User.password_not_set);
		}

		const { password: hashedPassword } = existingUser;

		const isPasswordValid = await authInfrastructure.hash.comparePassword(password, hashedPassword);

		if (!isPasswordValid) {
			throw errorHandler.throws(DomainErrors.User.invalid_credentials);
		}

		const {
			password: _password,
			salt: _salt,
			...publicUser
		} = await userRepository.patch(existingUser.id, {
			lastLogin: new Date()
		});

		return publicUser;
	};

	return { authenticateWithCredentials };
};
