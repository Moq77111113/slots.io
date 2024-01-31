import type { MaybePromise, Paginated } from '$domain/@shared';
import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type { PatchUserDto, UpdateUserDto, UpsertUserDto } from '$domain/user/dtos/in/user-input';
import type { User, UserId } from '$domain/user/models';

export type UserQuery = {
	findById: (id: UserId) => MaybePromise<User | null>;
	findBy: {
		email: (email: User['email']) => MaybePromise<User | null>;
	};
	findMany: (filters: UserFilters) => MaybePromise<Paginated<User>>;
};

export type UserCommand = {
	update(data: UpdateUserDto): MaybePromise<User>;
	patch(data: PatchUserDto): MaybePromise<User>;
	delete(id: UserId): MaybePromise<User>;
	upsert(data: UpsertUserDto): MaybePromise<User>;
};

/**
 * `UserRepository` is the secondary port for user-related operations in our hexagonal architecture.
 * It provides an interface for querying and commanding user data.
 *
 * The `UserQuery` part includes methods for finding a user by ID or email, and for finding many users based on filters.
 * The `UserCommand` part includes methods for updating, patching, deleting, and upserting a user.
 *
 * Each method returns a `MaybePromise`, allowing for both synchronous and asynchronous implementations.
 * This makes `UserRepository` adaptable to various infrastructures and technologies.
 *
 * As a secondary port, `UserRepository` is used to adapt the application to external services or systems, such as a database.
 *
 */
export type UserRepository = UserQuery & UserCommand;
