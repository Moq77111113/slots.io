import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { LogoutUserArgs } from '$domain/user/dtos/in/authentication.input';

type LogoutAction = Action<[LogoutUserArgs], Promise<void>>;
export const LogoutUserAction = ((context) => {
	const { userApi } = context.apis;
	const _name = 'user.logout' as const;

	const execute = async (args: LogoutUserArgs) => {
		const { userId } = args;
		await userApi.logout({ userId });
	};

	return {
		execute
	};
}) satisfies ActionAdapter<LogoutAction, AppContext>;
