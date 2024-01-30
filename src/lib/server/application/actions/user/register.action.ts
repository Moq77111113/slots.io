import type { RegisterUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { RegisterApi } from '$domain/user/ports/api/user.api';

type RegisterUserActionContext = {
	services: {
		user: RegisterApi;
	};
};

export const RegisterUserAction = (context: RegisterUserActionContext) => {
	const { services } = context;
	const _name = 'user.register';

	const handler = async (args: RegisterUserArgs) => {
		const { email, password } = args;
		const user = await services.user.register({ email, password });
		return user;
	};

	return {
		handler
	};
};
