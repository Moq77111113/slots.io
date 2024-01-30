import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { AuthRequest } from '$domain/user/dtos/out/authentication.output';

type GenerateOAuthRequestAction = Action<[string], Promise<AuthRequest>>;
export const GenerateOAuthRequest = ((context: AppContext) => {
	const { userApi } = context.apis;
	const _name = 'user.genTpRequest' as const;

	const execute = async (provider: string) => {
		return await userApi.generateThirdPartyRequest(provider);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<GenerateOAuthRequestAction, AppContext>;
