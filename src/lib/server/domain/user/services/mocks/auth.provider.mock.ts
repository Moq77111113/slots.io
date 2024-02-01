import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type {
	AuthenticateUserArgs,
	LogoutUserArgs,
	OAuthAuthenticationArgs
} from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import { makeUserId, type UserId } from '$domain/user/models';
import type { AuthProvider } from '$domain/user/ports/spi/auth.provider';

export const MockedAuthProvider = (): AuthProvider => {
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
				authUrlWithoutRedirect: 'mock-auth-url'
			});
		},
		authOrRegisterWithThirdParty: (_request: OAuthAuthenticationArgs): Promise<UserId> => {
			return Promise.resolve(makeUserId('mock-user-id'));
		},
		logout: (_args: LogoutUserArgs): Promise<void> => {
			return Promise.resolve();
		},
		getMe: (): Promise<UserId | null> => {
			return Promise.resolve(makeUserId('mock-user-id'));
		}
	};
};
