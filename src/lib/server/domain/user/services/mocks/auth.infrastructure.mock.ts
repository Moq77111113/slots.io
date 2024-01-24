import type { HashPasswordDto } from '$domain/user/dtos/authentication.input';
import type { User } from '$domain/user/models';
import type { AuthInfrastructure } from '$domain/user/ports/spi';

export const MockedAuthInfrastructure = (): AuthInfrastructure => {
	const authenticate = {
		byCredentials: (_email: User['email'], _password: User['password']) => {
			return Promise.resolve(null);
		},
		byThirdPartyAccount: (_thirdPartyAccount: User['thirdPartyAccounts'][number]) => {
			return Promise.resolve(null);
		}
	};

	const hash = {
		generateSalt: () => {
			const salt = Array.from({ length: 16 }, () =>
				Math.floor(Math.random() * 36).toString(36)
			).join('');
			return Promise.resolve(salt);
		},
		hashPassword: ({ password, salt }: HashPasswordDto) => {
			return Promise.resolve(`hashed_${password}_${salt}`);
		}
	};

	return {
		authenticate,
		hash
	};
};
