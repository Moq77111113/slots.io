import type { UserId } from '$domain/user/models';

export type HashPasswordDto = {
	password: string;
	salt: string;
};

export type RegisterUserArgs = {
	email: string;
	password: string;
};

export type AuthenticateUserArgs = RegisterUserArgs;

export type OAuthAuthenticationArgs = {
	provider: string;
	code: string;
};

export type LogoutUserArgs = {
	userId: UserId;
};
