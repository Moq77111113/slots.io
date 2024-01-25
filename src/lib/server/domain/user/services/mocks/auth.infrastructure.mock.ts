import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type {
	AuthenticateUserArgs,
	OAuthAuthenticationArgs
} from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import { makeUserId, type UserId } from '$domain/user/models';
import type { AuthInfrastructure } from '$domain/user/ports/spi/auth.infrastructure';

export const MockedAuthInfrastructure = (): AuthInfrastructure => {
	return {
		registerWithCredentials: (_args: AuthenticateUserArgs): Promise<UserId> => {
			return Promise.resolve(makeUserId('mock-user-id'));
		},
		authenticateWithCredentials: (_args: AuthenticateUserArgs): Promise<UserId> => {
			return Promise.resolve(makeUserId('mock-user-id'));
		},
		getProviders: (): Promise<ThirdPartyAccount['provider'][]> => {
			return Promise.resolve(['mock-provider']);
		},
		generateThirdPartyRequest: (provider: ThirdPartyAccount['provider']): Promise<AuthRequest> => {
			return Promise.resolve({
				provider,
				request: 'mock-request',
				state: 'mock-state',
				codeVerifier: 'mock-code-verifier',
				authUrl: 'mock-auth-url'
			});
		},
		authOrRegisterWithThirdParty: (_request: OAuthAuthenticationArgs): Promise<UserId> => {
			return Promise.resolve(makeUserId('mock-user-id'));
		}
	};
};
