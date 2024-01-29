export type HashPasswordDto = {
	password: string;
	salt: string;
};

export type RegisterUserDto = {
	email: string;
	password: string;
};

export type AuthenticateUserArgs = RegisterUserDto;

export type OAuthAuthenticationArgs = {
	provider: string;
	code: string;
};
