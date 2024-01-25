import type { User } from '../models';
import { UserAuthenticateSubService } from './subservices/user.authenticate.subservice';
import { UserRegisterSubService } from './subservices/user.register.subservice';
import { UserThirdPartyService } from './subservices/user.thirdparty.subservice';
import type { PublicUser, UserServiceContext } from './types';

export const UserService = (context: UserServiceContext) => {
	return {
		...UserRegisterSubService(context),
		...UserAuthenticateSubService(context),
		...UserThirdPartyService(context)
	};
};

export const toPublic = (user: User): PublicUser => {
	const { password: _, salt: __, ...publicUser } = user;
	return publicUser;
};
export type UserService = ReturnType<typeof UserService>;
