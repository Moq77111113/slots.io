import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/user-filters';
import type { CreateUserDto, PatchUserDto, UpdateUserDto } from '$domain/user/dtos/user-input';
import { makeUserId, type User, type UserId } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';

const users: User[] = [];

export const MockedUserRepository = (): UserRepository => {
	const findById = (id: UserId) => {
		return Promise.resolve(users.find((user) => user.id === id) || null);
	};

	const findBy = {
		email: (email: User['email']) => {
			return Promise.resolve(users.find((user) => user.email === email) || null);
		},
		thirdPartyAccount: ({ accountId, provider }: ThirdPartyAccount) => {
			return Promise.resolve(
				users.find((user) =>
					user.thirdPartyAccounts.find((_) => _.accountId === accountId && _.provider === provider)
				) || null
			);
		}
	};

	const findMany = (filters: UserFilters) => {
		const { language, status, limit = 10, page = 0 } = filters;

		const filtered = users.filter((user) => {
			if (language && user.language.code !== language) return false;
			if (status && user.status !== status) return false;
			return true;
		});

		const paginated = filtered.slice(page * limit, page * limit + limit);

		return Promise.resolve({
			data: paginated,
			total: filtered.length,
			page,
			limit
		});
	};
	const create = (data: CreateUserDto) => {
		const newUser: User = {
			id: makeUserId(''),
			...data,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		users.push(newUser);
		return Promise.resolve(newUser);
	};

	const update = (id: UserId, data: UpdateUserDto) => {
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error(`User ${id} not found`);
		}
		users[index] = { ...users[index], ...data };
		return Promise.resolve(users[index]);
	};

	const patch = (id: UserId, data: PatchUserDto) => {
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error(`User ${id} not found`);
		}
		users[index] = { ...users[index], ...data, updatedAt: new Date() };

		return Promise.resolve(users[index]);
	};

	const remove = (id: UserId) => {
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error(`User ${id} not found`);
		}
		const [deletedUser] = users.splice(index, 1);
		return Promise.resolve(deletedUser);
	};

	return {
		findById,
		findBy,
		findMany,
		create,
		update,
		patch,
		delete: remove
	};
};