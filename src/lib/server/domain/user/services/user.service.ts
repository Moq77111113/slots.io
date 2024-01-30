import type { UserApi } from '../ports/api/user.api';
import { UserAuthenticateSubService } from './subservices/user.authenticate.subservice';
import { UserLogoutSubService } from './subservices/user.logout.service';
import { UserRegisterSubService } from './subservices/user.register.subservice';
import { UserThirdPartyService } from './subservices/user.thirdparty.subservice';
import type { UserServiceContext } from './types';

export const UserService = (context: UserServiceContext) => {
	return {
		...UserRegisterSubService(context),
		...UserAuthenticateSubService(context),
		...UserThirdPartyService(context),
		...UserLogoutSubService(context)
	} satisfies UserApi;
};

export type UserService = ReturnType<typeof UserService>;
