export type AuthRequest = {
	provider: string;
	authUrlWithoutRedirect: string;
	codeVerifier: string;
};
