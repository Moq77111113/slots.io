import type { ActionContext } from '$domain/@shared';
import type { CreateUserDto } from '$domain/user/dtos/user-input';
import type { User } from '$domain/user/models';
import type { AuthInfrastructure, UserRepository } from '$domain/user/ports/spi';

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

export type PublicUser = Omit<User, 'password' | 'salt'>;
