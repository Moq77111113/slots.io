import type { RecordOptions } from 'pocketbase';

import { makeUserId, type User } from '$domain/user/models';
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
}) => {
	const {
		collections: { users }
	} = pocketbase;

	const toBusiness = (data: PocketBaseUser): User => {
		const {
			id,
			email,
			language,
			locale,
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
				language: language || { code: 'fr' },
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
		return await users
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
	};

	return {
		registerWithCredentials
	};
};

export type PocketBaseAuthProvider = ReturnType<typeof PocketBaseAuthProvider>;
