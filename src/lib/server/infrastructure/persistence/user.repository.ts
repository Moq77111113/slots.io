import { z } from 'zod';

import type { Language, ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type {
	CreateUserDto,
	PatchUserDto,
	UpdateUserDto,
	UpsertUserDto
} from '$domain/user/dtos/in/user-input';
import { makeUserId, type User } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';
import { Collections, type UsersResponse } from '$infrastructure/generated/pb-types';
import { makePocketBaseRepository } from '$infrastructure/helpers/repository.helper';
import { validateData } from '$infrastructure/helpers/schema';
import type { PocketbaseInfrastructure } from '$infrastructure/persistence/pocketbase';

const schema = z.object({
	id: z.string(),
	email: z.string().email(),
	notificationsChannel: z.array(z.string()).default([]),
	lastLogin: z.date().nullable(),
	thirdPartyAccounts: z
		.array(z.object({ accountId: z.string(), provider: z.string() }))
		.default([]),
	language: z.object({
		code: z.union([z.literal('fr'), z.literal('en')]).default('fr')
	}),
	locale: z.union([z.literal('fr_FR'), z.literal('en_GB')]).default('fr_FR'),
	password: z.string().default(''),
	salt: z.string().default(''),
	accessToken: z.string().optional(),
	status: z.enum(['active', 'inactive']),
	createdAt: z.date(),
	updatedAt: z.date()
});

type Relations = {
	thirdPartyAccounts: ThirdPartyAccount[];
};
type PocketBaseUser = UsersResponse<Language, string[], Relations>;
export const PocketBaseUserRepository = ({
	pocketbase
}: {
	pocketbase: PocketbaseInfrastructure;
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
			schema
		);
		if (result) {
			return {
				...result,
				id: makeUserId(result.id)
			};
		}
		console.error(error);
		throw new Error('Failed');
	};

	const toBusinessList = (data: PocketBaseUser[]): User[] => data.map(toBusiness);
	const { repository: users } = makePocketBaseRepository<PocketBaseUser>(
		{ pocketbase },
		{ collection: Collections.Users }
	);

	const findById = async (id: string) => {
		return users
			.getOne(id, { expand: 'thirdPartyAccounts' })
			.then(toBusiness)
			.catch(() => null);
	};

	const findByEmail = async (email: string) => {
		return users
			.getFirstListItem(`email = "${email}"`, { expand: 'thirdPartyAccounts' })
			.then(toBusiness)
			.catch(() => null);
	};

	const findByThirdPartyAccount = async (thirdPartyAccount: ThirdPartyAccount) => {
		return users
			.getFirstListItem(`thirdPartyAccount = "${thirdPartyAccount.accountId}"`)
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
			filter: filter.length ? filter.join(' && ') : '',
			expand: 'thirdPartyAccounts'
		});
		return {
			data: toBusinessList(result.items),
			total: result.totalItems,
			page,
			itemsPerPage
		};
	};

	const create = async (data: CreateUserDto): Promise<User> => {
		return await users
			.create({
				...data,
				passwordConfirm: data.password,
				status: data.status === 'active',
				emailVisibility: true
			})
			.then(toBusiness)
			.catch((e) => {
				console.error('QMO');
				console.error(e instanceof Error ? e.message : e);
				throw e;
			});
	};

	const update = async (data: UpdateUserDto): Promise<User> => {
		const { id, ...rest } = data;
		return await users.update(id, { ...rest, status: rest.status === 'active' }).then(toBusiness);
	};

	const patch = async (data: PatchUserDto): Promise<User> => {
		const { id, ...rest } = data;
		return await users.update(id, { ...rest, status: rest.status === 'active' }).then(toBusiness);
	};

	const remove = async (id: string): Promise<User> => {
		const user = await findById(id);
		if (!user) throw new Error('User not found');
		await users.delete(id);
		return user;
	};

	const upsert = (data: UpsertUserDto): Promise<User> => {
		const { id, ...rest } = data;
		if (id) {
			return update({ id, ...rest });
		}
		return create(rest);
	};
	return {
		findById,
		findBy: {
			email: findByEmail,
			thirdPartyAccount: findByThirdPartyAccount
		},
		findMany,
		create,
		update,
		patch,
		delete: remove,
		upsert
	};
};
