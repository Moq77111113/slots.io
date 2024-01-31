/**
 * @description An authorization request is used to authenticate a user with third party.
 */
export type AuthRequest = {
	provider: string;
	authUrlWithoutRedirect: string;
	codeVerifier: string;
};
