import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import { DomainErrors } from '$domain/@shared/errors';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';

import type { PublicUser, UserServiceContext } from '../types';
import { toPublic } from '../user.service';

export const UserThirdPartyService = (context: UserServiceContext) => {
	const {
		repositories: { userRepository },
		infrastructure: { authInfrastructure },
		shared: { errorHandler }
	} = context;

	const isProviderEnabled = async (provider: ThirdPartyAccount['provider']) => {
		const providers = await authInfrastructure.getProviders();
		return providers.includes(provider);
	};

	const checkProvider = async (provider: ThirdPartyAccount['provider']) => {
		if (!(await isProviderEnabled(provider))) {
			throw errorHandler.throws(DomainErrors.User.provider_not_enabled(provider));
		}
	};

	const wrapPort = {
		authenticateWithThirdParty: async (args: OAuthAuthenticationArgs) =>
			await authInfrastructure.authOrRegisterWithThirdParty(args)
	};

	const generateThirdPartyRequest = async (
		provider: ThirdPartyAccount['provider']
	): Promise<AuthRequest> => {
		await checkProvider(provider);

		return authInfrastructure.generateThirdPartyRequest(provider);
	};

	const authOrRegisterWithThirdParty = async (
		provider: ThirdPartyAccount['provider'],
		request: Omit<OAuthAuthenticationArgs, 'provider'>
	): Promise<PublicUser> => {
		await checkProvider(provider);

		const userId = await wrapPort.authenticateWithThirdParty({ provider, ...request }).catch(() => {
			throw errorHandler.throws(DomainErrors.User.oauth_failed);
		});

		return toPublic(
			await userRepository.patch({
				id: userId,
				lastLogin: new Date()
			})
		);
	};

	return {
		generateThirdPartyRequest,
		authOrRegisterWithThirdParty
	};
};

export type UserThirdPartyService = ReturnType<typeof UserThirdPartyService>;
