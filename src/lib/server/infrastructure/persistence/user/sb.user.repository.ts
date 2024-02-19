import type { UserFilters } from '#/domain/user/dtos/in/user-filters';
import type { PatchUserDto, UpdateUserDto, UpsertUserDto } from '#/domain/user/dtos/in/user-input';
import { type User, type UserId } from '#/domain/user/models';
import type { UserRepository } from '#/domain/user/ports/spi';
import { type SupabaseInfrastructure } from '#/infrastructure';
import { supabaseToDomain } from '#/infrastructure/mappers';

export const SupabaseUserRepository = ({
	users
}: {
	users: SupabaseInfrastructure['users'];
}): UserRepository => {
	const findById = async (id: UserId) => {
		const { data } = await users.select('*').eq('id', id).single();
		return data ? supabaseToDomain.user(data) : null;
	};

	const findByEmail = async (email: User['email']) => {
		const { data } = await users.select('*').eq('email', email).single();
		return data ? supabaseToDomain.user(data) : null;
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
			data: data?.map((_) => supabaseToDomain.user(_)) || [],
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
		return supabaseToDomain.user(user);
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
		return supabaseToDomain.user(user);
	};

	const deleteById = async (id: UserId) => {
		const { data, error } = await users.delete().eq('id', id).select().single();

		if (error) {
			throw Error(error.message);
		}

		return supabaseToDomain.user(data);
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
		return supabaseToDomain.user(user);
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
