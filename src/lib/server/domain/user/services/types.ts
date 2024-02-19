import type { ActionContext } from '#/domain/@shared';
import type { UserRepository } from '#/domain/user/ports/spi';

import type { AuthProvider } from '../ports/spi/auth.provider';

export type UserServiceContext = ActionContext & {
	repositories: {
		userRepository: UserRepository;
	};
	providers: {
		authProvider: AuthProvider;
	};
};
