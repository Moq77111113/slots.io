import { DomainErrors } from '$domain/@shared/errors';
import type { UserId } from '$domain/user/models';

import type { UserServiceContext } from '../types';

export const UserLogoutSubService = (context: UserServiceContext) => {
	const {
		infrastructure: { authInfrastructure },
		shared: { errorHandler }
	} = context;

	const wrapPort = {
		logout: async (userId: UserId) => {
			await authInfrastructure.logout({ userId });
		}
	};

	const logout = async (userId: UserId): Promise<void> => {
		await wrapPort.logout(userId).catch(() => {
			throw errorHandler.throws(DomainErrors.User.logout_failed);
		});

		return;
	};

	return {
		logout
	};
};
