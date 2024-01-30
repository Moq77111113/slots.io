import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { RegisterUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { User } from '$domain/user/models';

type RegisterAction = Action<[RegisterUserArgs], Promise<User>>;
export const RegisterUserAction = ((context: AppContext) => {
	const { userApi } = context.apis;
	const _name = 'user.register' as const;

	const execute = async (args: RegisterUserArgs) => {
		const { email, password } = args;
		const user = await userApi.register({ email, password });
		return user;
	};

	return {
		execute
	};
}) satisfies ActionAdapter<RegisterAction, AppContext>;
