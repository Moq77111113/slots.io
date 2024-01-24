import type { MaybePromise } from '$domain/@shared';
import type { HashPasswordDto } from '$domain/user/dtos/authentication.input';
import type { User } from '$domain/user/models';

export type AuthCommand = {
	authenticate: {
		byCredentials: (email: User['email'], password: string) => MaybePromise<User | null>;
		byThirdPartyAccount: (
			thirdPartyAccount: User['thirdPartyAccounts'][number]
		) => MaybePromise<User | null>;
	};
	hash: {
		generateSalt: () => MaybePromise<string>;
		hashPassword: (args: HashPasswordDto) => MaybePromise<string>;
		comparePassword: (password: string, hashedPassword: string) => MaybePromise<boolean>;
	};
};

export type AuthInfrastructure = AuthCommand;
