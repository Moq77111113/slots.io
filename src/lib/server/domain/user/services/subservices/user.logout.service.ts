import { DomainErrors } from '$domain/@shared/errors';
import type { LogoutUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { UserId } from '$domain/user/models';
import type { LogoutApi } from '$domain/user/ports/api/user.api';

import type { UserServiceContext } from '../types';

export const UserLogoutSubService = (context: UserServiceContext): LogoutApi => {
	const {
		providers: { authProvider },
		shared: { errorHandler }
	} = context;

	const wrapPort = {
		logout: async (userId: UserId) => {
			await authProvider.logout({ userId });
		}
	};

	const logout = async ({ userId }: LogoutUserArgs): Promise<void> => {
		await wrapPort.logout(userId).catch(() => {
			throw errorHandler.throws(DomainErrors.User.logout_failed);
		});

		return;
	};

	return {
		logout
	};
};
