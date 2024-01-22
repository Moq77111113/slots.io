import type { MaybePromise, Paginated } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { UserFilters } from '$domain/user/dtos/user-filters';
import type { CreateUserDto, PatchUserDto, UpdateUserDto } from '$domain/user/dtos/user-input';
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
	create(data: CreateUserDto): MaybePromise<User>;
	update(id: UserId, data: UpdateUserDto): MaybePromise<User>;
	patch(id: UserId, data: PatchUserDto): MaybePromise<User>;
	delete(id: UserId): MaybePromise<User>;
};

export type UserRepository = UserQuery & UserCommand;
