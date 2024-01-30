import type { ThirdPartyAccount } from '$domain/@shared/attributes';
import type { OAuthAuthenticationArgs } from '$domain/user/dtos/in/authentication.input';
import type { ThirdPartyApi } from '$domain/user/ports/api/user.api';

type LogoutUserActionContext = {
	services: {
		user: ThirdPartyApi;
	};
};

export const LoginWithThirdPartyAction = (context: LogoutUserActionContext) => {
	const { services } = context;
	const _name = 'user.loginWithThirdParty' as const;

	const execute = async (
		provider: ThirdPartyAccount['provider'],
		request: Omit<OAuthAuthenticationArgs, 'provider'>
	) => {
		return await services.user.authOrRegisterWithThirdParty(provider, request);
	};

	return {
		execute
	};
};
