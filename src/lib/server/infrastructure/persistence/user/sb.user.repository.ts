import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type { PatchUserDto, UpdateUserDto, UpsertUserDto } from '$domain/user/dtos/in/user-input';
import { makeUserId, type User, type UserId } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';
import {
	DomainSchemas,
	type Profile,
	type SupabaseInfrastructure,
	validateData
} from '$infrastructure';

const toUser = (profile: Profile): User => {
	const [user, error] = validateData<(typeof DomainSchemas)['User']>(
		{
			...profile,
			language: {
				code: profile.language
			},
			status: profile.status ? 'active' : 'inactive',
			createdAt: new Date(profile.created_at),
			updatedAt: new Date(profile.updated_at || profile.created_at),
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: profile.last_login ? new Date(profile.last_login) : null
		},
		DomainSchemas.User
	);
	if (error) {
		throw Error(error.formErrors[0] || 'Invalid user data');
	}
	return {
		...user,
		id: makeUserId(user.id)
	};
};
export const SupabaseUserRepository = ({
	users
}: {
	users: SupabaseInfrastructure['users'];
}): UserRepository => {
	const findById = async (id: UserId) => {
		const { data } = await users.select('*').eq('id', id).single();
		return data ? toUser(data) : null;
	};

	const findByEmail = async (email: User['email']) => {
		const { data } = await users.select('*').eq('email', email).single();
		return data ? toUser(data) : null;
	};

	const findMany = async ({ page = 1, itemsPerPage = 10, status, language }: UserFilters) => {
		let query = users.select('*');

		if (status) {
			query = query.eq('status', status === 'active');
		}

		if (language) {
			query = query.eq('language', language);
		}
		const from = (page - 1) * itemsPerPage;
		const to = page * itemsPerPage - 1;

		const { data, count } = await query.range(from, to);

		return {
			data: data?.map(toUser) || [],
			total: count || 0,
			page: page,
			itemsPerPage: itemsPerPage
		};
	};
	const update = async (data: UpdateUserDto) => {
		const { data: user, error } = await users
			.update({
				email: data.email,
				language: data.language.code,
				locale: data.locale,
				status: data.status === 'active',
				updated_at: new Date().toISOString()
			})
			.eq('id', data.id)
			.select()
			.single();

		if (error) {
			throw Error(error.message);
		}
		return toUser(user);
	};

	const patch = async (data: PatchUserDto) => {
		const { data: user, error } = await users
			.update({
				email: data.email,
				language: data.language?.code,
				locale: data.locale,
				status: data.status === 'active',
				updated_at: new Date().toISOString(),
				last_login: data.lastLogin?.toISOString()
			})
			.eq('id', data.id)
			.select()
			.single();

		if (error) {
			throw Error(error.message);
		}
		return toUser(user);
	};

	const deleteById = async (id: UserId) => {
		const { data, error } = await users.delete().eq('id', id).select().single();

		if (error) {
			throw Error(error.message);
		}

		return toUser(data);
	};

	const upsert = async (data: UpsertUserDto) => {
		const { data: user, error } = await users
			.upsert({
				id: data.id,
				email: data.email,
				language: data.language.code,
				locale: data.locale,
				status: data.status === 'active',
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw Error(error.message);
		}
		return toUser(user);
	};
	return {
		findById,
		findBy: { email: findByEmail },
		findMany,
		update,
		patch,
		delete: deleteById,
		upsert
	};
};
