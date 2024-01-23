import type { ActionContext } from '$domain/@shared';
import { Errors } from '$domain/@shared/errors';
import type { User } from '$domain/user/models';

import type { CreateUserDto } from '../dtos/user-input';
import type { AuthService, UserRepository } from '../ports/spi';

export type UserServiceContext = ActionContext & {
	repositories: {
		userRepository: UserRepository;
		authService: AuthService;
	};
};

export type RegisterUserArgs = {
	email: CreateUserDto['email'];
	password: NonNullable<CreateUserDto['password']>;
};

export type PublicUser = Omit<User, 'password' | 'salt'>;
export const UserService = (context: UserServiceContext) => {
	const { userRepository, authService } = context.repositories;
	const {
		shared: { errorHandler }
	} = context;

	const getUserByEmail = (email: string) => userRepository.findBy.email(email);
	const register = async (args: RegisterUserArgs): Promise<PublicUser> => {
		const { email, password } = args;
		const exists = getUserByEmail(args.email);

		if (exists) {
			throw errorHandler.handle(Errors.User.already_exists(email));
		}

		const salt = await authService.hash.generateSalt();
		const hashedPassword = await authService.hash.hashPassword({ password, salt });

		const createdUser = await userRepository.create({
			email,
			password: hashedPassword,
			salt,
			status: 'active',
			language: { code: 'fr' },
			notificationsChannel: [],
			thirdPartyAccounts: [],
			lastLogin: null,
			locale: 'fr_FR'
		});
		const { password: _, salt: __, ...publicUser } = createdUser;
		return publicUser;
	};
	return {
		getUserByEmail,
		register
	};
};

export type UserService = ReturnType<typeof UserService>;
