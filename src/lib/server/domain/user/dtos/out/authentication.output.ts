export type AuthRequest = {
	provider: string;
	state: string;
	authUrl: string;
	codeVerifier: string;
};
