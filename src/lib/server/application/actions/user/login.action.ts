import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { AuthenticateUserArgs } from '$domain/user/dtos/in/authentication.input';
import type { User } from '$domain/user/models';

type LoginAction = Action<[AuthenticateUserArgs], Promise<User>>;
export const LoginUserAction = ((context) => {
	const { userApi } = context.apis;
	const _name = 'user.login' as const;

	const execute = async (args: AuthenticateUserArgs) => {
		const { email, password } = args;
		const user = await userApi.authenticate({ email, password });
		return user;
	};

	return {
		execute
	};
}) satisfies ActionAdapter<LoginAction, AppContext>;
