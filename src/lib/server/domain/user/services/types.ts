import type { ActionContext } from '$domain/@shared';
import type { CreateUserDto } from '$domain/user/dtos/in/user-input';
import type { User } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';

import type { AuthInfrastructure } from '../ports/spi/auth.infrastructure';

export type UserServiceContext = ActionContext & {
	repositories: {
		userRepository: UserRepository;
	};
	infrastructure: {
		authInfrastructure: AuthInfrastructure;
	};
};

export type RegisterUserArgs = {
	email: CreateUserDto['email'];
	password: NonNullable<CreateUserDto['password']>;
};

export type AuthenticateUserArgs = {
	email: CreateUserDto['email'];
	password: NonNullable<CreateUserDto['password']>;
};

export type PublicUser = Omit<User, 'password' | 'salt'>;
