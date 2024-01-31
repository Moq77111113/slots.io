import type { UserId } from '$domain/user/models';

/**
 * @description Dto to hash a password.
 */
export type HashPasswordDto = {
	password: string;
	salt: string;
};

/**
 * @description Dto to register a user.
 */
export type RegisterUserArgs = {
	email: string;
	password: string;
};

/**
 * @description Dto to authenticate a user.
 */
export type AuthenticateUserArgs = RegisterUserArgs;

/**
 * @description Dto to authenticate a user with OAuth.
 */
export type OAuthAuthenticationArgs = {
	provider: string;
	code: string;
};

/**
 * @description Dto to logout a user.
 */
export type LogoutUserArgs = {
	userId: UserId;
};
