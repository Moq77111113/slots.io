import type { MaybePromise } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type {
	AuthenticateUserArgs,
	LogoutUserArgs,
	OAuthAuthenticationArgs,
	RegisterUserArgs
} from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import type { UserId } from '$domain/user/models';
export type AuthCommand = {
	registerWithCredentials: (args: RegisterUserArgs) => MaybePromise<UserId>;
	authenticateWithCredentials: (args: AuthenticateUserArgs) => MaybePromise<UserId>;
	logout: (args: LogoutUserArgs) => MaybePromise<void>;
};

export type ThirdPartyCommand = {
	getProviders: () => MaybePromise<ThirdPartyAccount['provider'][]>;
	generateThirdPartyRequest: (provider: ThirdPartyAccount['provider']) => MaybePromise<AuthRequest>;
	authOrRegisterWithThirdParty: (request: OAuthAuthenticationArgs) => MaybePromise<UserId>;
};

/**
 * `AuthProvider` is the secondary port for authentication-related operations in our hexagonal architecture.
 * It provides an interface for registering, authenticating, and logging out users, as well as
 * generating third-party authentication requests and authenticating or registering users with a third-party provider.
 *
 * Each method returns a `MaybePromise`, allowing for both synchronous and asynchronous implementations.
 * This makes `AuthProvider` adaptable to various infrastructures and technologies.
 *
 */
export type AuthProvider = AuthCommand & ThirdPartyCommand;
