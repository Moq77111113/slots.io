import type { AppContext } from '#/application/context';
import type { Action, ActionAdapter } from '#/domain/@shared';
import type { User } from '#/domain/user/models';

type GetMeAction = Action<[], Promise<User | null>>;
export const GetMeAction = ((context) => {
	const { userApi } = context.apis;
	const _name = 'user.getMe' as const;

	const execute = async () => {
		try {
			return await userApi.getMe();
		} catch {
			return null;
		}
	};

	return {
		execute
	};
}) satisfies ActionAdapter<GetMeAction, AppContext>;
