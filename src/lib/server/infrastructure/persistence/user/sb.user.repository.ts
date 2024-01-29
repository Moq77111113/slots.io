import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type { UpdateUserDto } from '$domain/user/dtos/in/user-input';
import { makeUserId, type User, type UserId } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';
import type { Profile, SupabaseInfrastructure } from '$infrastructure';

const toUser = (profile: Profile): User => {
	const { id, language, locale, created_at, status, updated_at, email, last_login } = profile;
	return {
		id: makeUserId(id),
		language: {
			code: language
		},
		locale,
		createdAt: new Date(created_at),
		status: status ? 'active' : 'inactive',
		updatedAt: updated_at ? new Date(updated_at) : new Date(created_at),
		thirdPartyAccounts: [],
		notificationsChannel: [],
		email,
		lastLogin: last_login && new Date(last_login)
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

	const findMany = async ({ page = 1, itemsPerPage = 10 }: UserFilters) => {
		const { data } = await users.select('*').range(page, page * itemsPerPage);
		return {
			data: data?.map(toUser) || [],
			total: data?.length || 0,
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

	const patch = async (data: UpdateUserDto) => {
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

	const deleteById = async (id: UserId) => {
		const { data, error } = await users.delete().eq('id', id).select().single();

		if (error) {
			throw Error(error.message);
		}

		return toUser(data);
	};

	const upsert = async (data: UpdateUserDto) => {
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
