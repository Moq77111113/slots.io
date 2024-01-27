export type AuthRequest = {
	provider: string;
	state: string;
	authUrlWithoutRedirect: string;
	codeVerifier: string;
};
