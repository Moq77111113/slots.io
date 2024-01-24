import { UserRegisterSubService } from './subservices/user.register.subservice';
import type { UserServiceContext } from './types';

export const UserService = (context: UserServiceContext) => {
	return {
		...UserRegisterSubService(context)
	};
};

export type UserService = ReturnType<typeof UserService>;
