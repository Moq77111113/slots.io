import { MeSubService } from './subservices/me.subservice';
import { UserAuthenticateSubService } from './subservices/user.authenticate.subservice';
import { UserLogoutSubService } from './subservices/user.logout.service';
import { UserRegisterSubService } from './subservices/user.register.subservice';
import { UserThirdPartyService } from './subservices/user.thirdparty.subservice';
import type { UserServiceContext } from './types';

/**
 * `UserService` is the domain service that handles user-related operations in our application.
 * It is called by the application layer through the `UserApi` interface.
 *
 * `UserService` composes several sub-services, each responsible for a specific user-related operation such as registration, authentication, third-party integration, and logout.
 * Each sub-service is initialized with the same context to ensure consistent access to shared resources.
 *
 */
export const UserService = (context: UserServiceContext) => {
	return {
		...UserRegisterSubService(context),
		...UserAuthenticateSubService(context),
		...UserThirdPartyService(context),
		...UserLogoutSubService(context),
		...MeSubService(context)
	};
};
