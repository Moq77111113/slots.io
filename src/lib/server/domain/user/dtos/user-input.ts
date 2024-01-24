import type { CreateEntityInput, PatchEntityInput, UpdateEntityInput } from '$domain/@shared/types';

import type { User } from '../models';

export type CreateUserDto = CreateEntityInput<User>;

export type UpdateUserDto = UpdateEntityInput<User>;

export type PatchUserDto = PatchEntityInput<User>;
