import type { RecordOptions } from 'pocketbase';

import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';
import { makeUserId, type User } from '$domain/user/models';
import type { AuthProvider } from '$domain/user/ports/spi';
import type { AuthenticateUserArgs } from '$domain/user/services/types';
import { DomainSchemas, validateData } from '$infrastructure';
import { PocketBaseInfrastructure } from '$infrastructure/pocketbase';
import type { PocketBaseEntities } from '$infrastructure/pocketbase/types';
import { entries } from '$lib/server/common/helpers/types';

type PocketBaseUser = PocketBaseEntities['User'];
export const PocketBaseAuthProvider = ({
	pocketbase
}: {
	pocketbase: PocketBaseInfrastructure;
}): AuthProvider => {
	const {
		collections: { users }
	} = pocketbase;

	const toBusiness = (data: PocketBaseUser): User => {
		const {
			id,
			email,
			language = { code: 'fr' },
			locale = 'fr_FR',
			status,
			created,
			updated,
			lastLogin,
			notificationsChannel,
			expand
		} = data;
		const [result, error] = validateData(
			{
				id,
				email,
				language,
				locale,
				status: status ? ('active' as const) : ('inactive' as const),
				createdAt: new Date(created),
				updatedAt: new Date(updated),
				lastLogin: lastLogin ? new Date(lastLogin) : null,
				notificationsChannel: notificationsChannel || [],
				thirdPartyAccounts: expand?.thirdPartyAccounts || []
			},
			DomainSchemas.User
		);
		if (result) {
			return {
				...result,
				id: makeUserId(result.id)
			};
		}

		const { fieldErrors, formErrors } = error;
		const fieldError = entries(fieldErrors).find(Boolean);
		throw new Error(fieldError ? fieldError.reverse().join(' :') : formErrors[0]);
	};

	const options = { expand: 'thirdPartyAccounts' } as const satisfies RecordOptions;

	const registerWithCredentials = async ({ email, password }: AuthenticateUserArgs) => {
		//TODO: add password validation to args ?
		const user = await users
			.create(
				{
					email,
					password,
					passwordConfirm: password,
					emailVisibility: true,
					language: {
						code: 'fr'
					},
					locale: 'fr_FR',
					status: true
				},
				options
			)
			.then(toBusiness);
		return user.id;
	};

	const authenticateWithCredentials = async ({ email, password }: AuthenticateUserArgs) => {
		const res = await users.authWithPassword(email, password, { ...options });

		const user = toBusiness(res.record);
		return user.id;
	};
	const listProviders = async () => {
		return await users.listAuthMethods({ fields: 'authProviders' });
	};
	const getProviders = async () => {
		return listProviders().then((res) => res.authProviders.map((_) => _.name));
	};

	const generateThirdPartyRequest = async (
		provider: ThirdPartyAccount['provider']
	): Promise<AuthRequest> => {
		const thirdParty = await listProviders().then((_) =>
			_.authProviders.find((_) => _.name === provider)
		);
		if (!thirdParty) throw new Error(`Provider ${provider} not found`);
		return {
			provider: thirdParty.name,
			state: thirdParty.state,
			authUrlWithoutRedirect: thirdParty.authUrl,
			codeVerifier: thirdParty.codeVerifier
		};
	};

	const authOrRegisterWithThirdParty = async (request: OAuthAuthenticationArgs) => {
		const { code, codeVerifier, provider, sourceUrl } = request;
		const { record: user } = await users.authWithOAuth2Code(
			provider,
			code,
			codeVerifier,
			sourceUrl,
			{},
			{ ...options }
		);
		return toBusiness(user).id;
	};

	const logout = async () => {};
	return {
		registerWithCredentials,
		authenticateWithCredentials,
		getProviders,
		generateThirdPartyRequest,
		authOrRegisterWithThirdParty,
		logout
	};
};

export type PocketBaseAuthProvider = ReturnType<typeof PocketBaseAuthProvider>;
