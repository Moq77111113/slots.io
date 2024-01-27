import type { MaybePromise, Paginated } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/in/user-filters';
import type { PatchUserDto, UpdateUserDto, UpsertUserDto } from '$domain/user/dtos/in/user-input';
import type { User, UserId } from '$domain/user/models';

export type UserQuery = {
	findById: (id: UserId) => MaybePromise<User | null>;
	findBy: {
		email: (email: User['email']) => MaybePromise<User | null>;
		thirdPartyAccount: (thirdPartyAccount: ThirdPartyAccount) => MaybePromise<User | null>;
	};
	findMany: (filters: UserFilters) => MaybePromise<Paginated<User>>;
};

export type UserCommand = {
	update(data: UpdateUserDto): MaybePromise<User>;
	patch(data: PatchUserDto): MaybePromise<User>;
	delete(id: UserId): MaybePromise<User>;
	upsert(data: UpsertUserDto): MaybePromise<User>;
};

export type UserRepository = UserQuery & UserCommand;
