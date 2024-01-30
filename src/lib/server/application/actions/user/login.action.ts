import type { AuthenticateUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { AuthenticateApi } from '$domain/user/ports/api/user.api';

type LoginActionContext = {
	services: {
		user: AuthenticateApi;
	};
};

export const LoginUserAction = (context: LoginActionContext) => {
	const { services } = context;
	const _name = 'user.login' as const;

	const handler = async (args: AuthenticateUserArgs) => {
		const { email, password } = args;
		const user = await services.user.authenticate({ email, password });
		return user;
	};

	return {
		handler
	};
};
