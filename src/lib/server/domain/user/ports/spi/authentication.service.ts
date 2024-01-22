import type { User } from '$domain/user/models';

export type AuthQuery = {
	authenticate: {
		byCredentials: (email: User['email'], password: string) => Promise<User | null>;
		byAccessToken: (accessToken: string) => Promise<User | null>;
		byThirdPartyAccount: (
			thirdPartyAccount: User['thirdPartyAccounts'][number]
		) => Promise<User | null>;
	};
};

export type AuthService = AuthQuery;
