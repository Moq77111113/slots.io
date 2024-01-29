import type { ActionContext } from '$domain/@shared';
import type { CreateUserDto } from '$domain/user/dtos/in/user-input';
import type { User } from '$domain/user/models';
import type { UserRepository } from '$domain/user/ports/spi';

import type { AuthProvider } from '../ports/spi/auth.provider';

export type UserServiceContext = ActionContext & {
	repositories: {
		userRepository: UserRepository;
	};
	providers: {
		authProvider: AuthProvider;
	};
};

export type RegisterUserArgs = {
	email: CreateUserDto['email'];
	password: string;
};

export type AuthenticateUserArgs = {
	email: CreateUserDto['email'];
	password: string;
};

export type LogoutUserArgs = {
	userId: User['id'];
};

export type PublicUser = Omit<User, 'password' | 'salt'>;
