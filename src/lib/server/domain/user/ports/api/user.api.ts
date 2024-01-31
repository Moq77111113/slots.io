import type { MaybePromise } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type {
	AuthenticateUserArgs,
	LogoutUserArgs,
	OAuthAuthenticationArgs,
	RegisterUserArgs
} from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import type { User } from '$domain/user/models';

export type RegisterApi = {
	register: (args: RegisterUserArgs) => MaybePromise<User>;
};

export type AuthenticateApi = {
	authenticate: (args: AuthenticateUserArgs) => MaybePromise<User>;
};

export type LogoutApi = {
	logout: (args: LogoutUserArgs) => MaybePromise<void>;
};

export type ThirdPartyApi = {
	generateThirdPartyRequest: (provider: string) => MaybePromise<AuthRequest>;
	authOrRegisterWithThirdParty: (
		provider: ThirdPartyAccount['provider'],
		request: Omit<OAuthAuthenticationArgs, 'provider'>
	) => MaybePromise<User>;
};

/**
 * `UserApi` is the primary port for user-related operations in our hexagonal architecture.
 * It provides an interface for registering, authenticating, and logging out users, as well as
 * generating third-party authentication requests and authenticating or registering users with a third-party provider.
 *
 * Each method returns a `MaybePromise`, allowing for both synchronous and asynchronous implementations.
 * This makes `UserApi` adaptable to various infrastructures and technologies.
 *
 */
export type UserApi = RegisterApi & AuthenticateApi & LogoutApi & ThirdPartyApi;
