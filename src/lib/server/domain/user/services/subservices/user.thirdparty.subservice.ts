import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import { DomainErrors } from '$domain/@shared/errors';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import type { User } from '$domain/user/models/user';
import type { ThirdPartyApi } from '$domain/user/ports/api/user.api';

import type { UserServiceContext } from '../types';

export const UserThirdPartyService = (context: UserServiceContext): ThirdPartyApi => {
	const {
		repositories: { userRepository },
		providers: { authProvider },
		shared: { errorHandler }
	} = context;

	const isProviderEnabled = async (provider: ThirdPartyAccount['provider']) => {
		const providers = await authProvider.getProviders();
		return providers.includes(provider);
	};

	const checkProvider = async (provider: ThirdPartyAccount['provider']) => {
		if (!(await isProviderEnabled(provider))) {
			throw errorHandler.throws(DomainErrors.User.provider_not_enabled(provider));
		}
	};

	const wrapPort = {
		authenticateWithThirdParty: async (args: OAuthAuthenticationArgs) =>
			await authProvider.authOrRegisterWithThirdParty(args)
	};

	const generateThirdPartyRequest = async (
		provider: ThirdPartyAccount['provider']
	): Promise<AuthRequest> => {
		await checkProvider(provider);

		return authProvider.generateThirdPartyRequest(provider);
	};

	const authOrRegisterWithThirdParty = async (
		provider: ThirdPartyAccount['provider'],
		request: Omit<OAuthAuthenticationArgs, 'provider'>
	): Promise<User> => {
		await checkProvider(provider);

		const userId = await wrapPort.authenticateWithThirdParty({ provider, ...request }).catch(() => {
			throw errorHandler.throws(DomainErrors.User.oauth_failed);
		});

		return await userRepository.patch({
			id: userId,
			lastLogin: new Date()
		});
	};

	return {
		generateThirdPartyRequest,
		authOrRegisterWithThirdParty
	};
};

export type UserThirdPartyService = ReturnType<typeof UserThirdPartyService>;
