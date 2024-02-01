import { DomainErrors } from '$domain/@shared/errors';
import type { UserId } from '$domain/user/models';
import type { MeApi } from '$domain/user/ports/api/user.api';

import type { UserServiceContext } from '../types';

export const MeSubService = (context: UserServiceContext): MeApi => {
	const {
		repositories: { userRepository },
		providers: { authProvider },
		shared: { errorHandler }
	} = context;

	const wrapPort = {
		getMe: async () => await authProvider.getMe(),
		findById: async (id: UserId) => await userRepository.findById(id)
	};
	const getMe = async () => {
		const id = await wrapPort.getMe().catch(() => null);
		if (!id) {
			throw errorHandler.throws(DomainErrors.User.not_found);
		}

		const user = await wrapPort.findById(id).catch(() => null);

		if (!user) {
			throw errorHandler.throws(DomainErrors.User.not_found);
		}
		return user;
	};

	return {
		getMe
	};
};
