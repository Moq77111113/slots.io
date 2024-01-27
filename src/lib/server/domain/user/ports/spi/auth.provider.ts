import type { MaybePromise } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import type { UserId } from '$domain/user/models';
import type { AuthenticateUserArgs, LogoutUserArgs } from '$domain/user/services/types';

export type AuthCommand = {
	registerWithCredentials: (args: AuthenticateUserArgs) => MaybePromise<UserId>;
	authenticateWithCredentials: (args: AuthenticateUserArgs) => MaybePromise<UserId>;
	logout: (args: LogoutUserArgs) => MaybePromise<void>;
};

export type ThirdPartyCommand = {
	getProviders: () => MaybePromise<ThirdPartyAccount['provider'][]>;
	generateThirdPartyRequest: (provider: ThirdPartyAccount['provider']) => MaybePromise<AuthRequest>;
	authOrRegisterWithThirdParty: (request: OAuthAuthenticationArgs) => MaybePromise<UserId>;
};

export type AuthProvider = AuthCommand & ThirdPartyCommand;
