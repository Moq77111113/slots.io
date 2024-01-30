import type { LogoutUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { LogoutApi } from '$domain/user/ports/api/user.api';

type LogoutUserActionContext = {
	services: {
		user: LogoutApi;
	};
};

export const LoginUserAction = (context: LogoutUserActionContext) => {
	const { services } = context;
	const _name = 'user.logout' as const;

	const execute = async (args: LogoutUserArgs) => {
		const { userId } = args;
		await services.user.logout({ userId });
	};

	return {
		execute
	};
};
