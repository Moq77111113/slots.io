import type {
	CreateEntityInput,
	PatchEntityInput,
	UpdateEntityInput,
	UpsertEntityInput
} from '$domain/@shared/types';
import type { User } from '$domain/user/models';

export type CreateUserDto = CreateEntityInput<User>;

export type UpdateUserDto = UpdateEntityInput<User>;

export type PatchUserDto = PatchEntityInput<User>;

export type UpsertUserDto = UpsertEntityInput<User>;
