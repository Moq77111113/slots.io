import type { RecordOptions } from 'pocketbase';

import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type { PatchUserDto, UpdateUserDto, UpsertUserDto } from '$domain/user/dtos/in/user-input';
import { makeUserId, type User } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';
import { DomainSchemas, validateData } from '$infrastructure/helpers/schema';
import type { PocketBaseInfrastructure } from '$infrastructure/pocketbase/pocketbase';
import type { PocketBaseEntities } from '$infrastructure/pocketbase/types';
import { entries } from '$lib/server/common/helpers/types';

type PocketBaseUser = PocketBaseEntities['User'];
export const PocketBaseUserRepository = ({
	pocketbase
}: {
	pocketbase: PocketBaseInfrastructure;
}): UserRepository => {
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
	const toBusinessList = (data: PocketBaseUser[]): User[] => data.map(toBusiness);

	const options = { expand: 'thirdPartyAccounts' } as const satisfies RecordOptions;
	const {
		collections: { users }
	} = pocketbase;

	const findById = async (id: string) => {
		return users
			.getOne(id, options)
			.then(toBusiness)
			.catch(() => null);
	};

	const findByEmail = async (email: string) => {
		return users
			.getFirstListItem(`email = "${email}"`, options)
			.then(toBusiness)
			.catch(() => null);
	};

	const findByThirdPartyAccount = async (thirdPartyAccount: ThirdPartyAccount) => {
		return users
			.getFirstListItem(`thirdPartyAccount = "${thirdPartyAccount.accountId}"`, options)
			.then(toBusiness)
			.catch(() => null);
	};

	const findMany = async (filters: UserFilters) => {
		const { page = 1, itemsPerPage = 10, status, language } = filters;

		const filter = [
			status && `status = ${status === 'active'}`,
			language && `language.code="${language}"`
		].filter(Boolean);

		const result = await users.getList((page - 1) * itemsPerPage, itemsPerPage, {
			...options,
			filter: filter.length ? filter.join(' && ') : ''
		});
		return {
			data: toBusinessList(result.items),
			total: result.totalItems,
			page,
			itemsPerPage
		};
	};

	const update = async (data: UpdateUserDto): Promise<User> => {
		const { id, ...rest } = data;
		return await users
			.update(id, { ...rest, status: rest.status === 'active' }, options)
			.then(toBusiness);
	};

	const patch = async (data: PatchUserDto): Promise<User> => {
		const { id, ...rest } = data;
		return await users
			.update(id, { ...rest, status: rest.status ? rest.status === 'active' : undefined }, options)
			.then(toBusiness);
	};

	const remove = async (id: string): Promise<User> => {
		const user = await findById(id);
		if (!user) throw new Error('User not found');
		await users.delete(id);
		return user;
	};

	const upsert = async (data: UpsertUserDto): Promise<User> => {
		const { id, ...rest } = data;
		if (id) {
			return update({ id, ...rest });
		}
		return await users.create({ ...rest, status: rest.status === 'active' }).then(toBusiness);
	};
	return {
		findById,
		findBy: {
			email: findByEmail,
			thirdPartyAccount: findByThirdPartyAccount
		},
		findMany,
		update,
		patch,
		delete: remove,
		upsert
	};
};
