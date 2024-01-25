import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import { DomainErrors } from '$domain/@shared/errors';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import type { UserId } from '$domain/user/models';

import type { AuthenticateUserArgs, PublicUser, UserServiceContext } from '../types';

export const UserAuthenticateSubService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		infrastructure: { authInfrastructure },
		shared: { errorHandler }
	} = context;

	const authenticateOnPort = async (args: AuthenticateUserArgs): Promise<UserId> =>
		await authInfrastructure.authenticateWithCredentials(args);

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

		const id = await authenticateOnPort({ email: sanitizedEmail, password }).catch(() => {
			throw errorHandler.throws(DomainErrors.User.invalid_credentials);
		});

		const {
			password: _password,
			salt: _salt,
			...publicUser
		} = await userRepository.patch({
			id,
			lastLogin: new Date()
		});

		return publicUser;
	};

	const isProviderEnabled = async (provider: ThirdPartyAccount['provider']) => {
		const providers = await authInfrastructure.getProviders();
		return providers.includes(provider);
	};
	const generateAuthRequest = async (
		provider: ThirdPartyAccount['provider']
	): Promise<AuthRequest> => {
		if (!(await isProviderEnabled(provider))) {
			throw errorHandler.throws(DomainErrors.User.provider_not_enabled(provider));
		}

		return authInfrastructure.generateAuthRequest(provider);
	};

	return { authenticateWithCredentials, generateAuthRequest };
};
