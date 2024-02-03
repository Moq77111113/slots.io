import type { AppContext } from '$application/context';
import type { Action, ActionAdapter } from '$domain/@shared';
import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { Identity } from '$domain/@shared/types';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { User } from '$domain/user/models';

type LoginWithThirdPartyAction = Action<
	[string, Omit<OAuthAuthenticationArgs, 'provider'>],
	Promise<User>
>;
export const LoginWithThirdPartyAction = ((context) => {
	const { userApi } = context.apis;
	const _name = 'user.loginWithThirdParty' as const;

	const execute = async (
		provider: ThirdPartyAccount['provider'],
		request: Identity<Omit<OAuthAuthenticationArgs, 'provider'>>
	) => {
		return await userApi.authOrRegisterWithThirdParty(provider, request);
	};

	return {
		execute
	};
}) satisfies ActionAdapter<LoginWithThirdPartyAction, AppContext>;
