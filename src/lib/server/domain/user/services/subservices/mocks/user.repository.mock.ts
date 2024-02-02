import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type {
	CreateUserDto,
	PatchUserDto,
	UpdateUserDto,
	UpsertUserDto
} from '$domain/user/dtos/in/user-input';
import { makeUserId, type User, type UserId } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';

export const MockedUserRepository = (): UserRepository => {
	const users: User[] = [];
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
		const { language, status, itemsPerPage = 10, page = 1 } = filters;

		const filtered = users.filter((user) => {
			if (language && user.language.code !== language) return false;
			if (status && user.status !== status) return false;
			return true;
		});

		const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage + itemsPerPage);

		return Promise.resolve({
			data: paginated,
			total: filtered.length,
			page,
			itemsPerPage
		});
	};
	const create = (data: CreateUserDto) => {
		const newUser: User = {
			id: makeUserId(`userId-${Math.random() * 1000 * (Math.random() * 10)}`),
			...data,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		users.push(newUser);
		return Promise.resolve(newUser);
	};

	const update = (data: UpdateUserDto) => {
		const { id } = data;
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error(`User ${id} not found`);
		}
		users[index] = { ...users[index], ...data };
		return Promise.resolve(users[index]);
	};

	const patch = (data: PatchUserDto) => {
		const { id } = data;
		const index = users.findIndex((user) => user.id === id);
		if (index === -1) {
			throw new Error(`User ${id} not found`);
		}
		users[index] = { ...users[index], ...data, updatedAt: new Date() };

		return Promise.resolve(users[index]);
	};

	const upsert = (data: UpsertUserDto) => {
		const { id } = data;
		if (id && users.find((_) => _.id === id)) {
			return update({ ...data });
		}
		return create(data);
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
		update,
		patch,
		upsert,
		delete: remove
	};
};
