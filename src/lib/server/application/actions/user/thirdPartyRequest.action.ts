import type { ThirdPartyApi } from '$domain/user/ports/api/user.api';

type LogoutUserActionContext = {
	services: {
		user: ThirdPartyApi;
	};
};

export const GenerateOAuthRequest = (context: LogoutUserActionContext) => {
	const { services } = context;
	const _name = 'user.genTpRequest' as const;

	const execute = async (provider: string) => {
		return await services.user.generateThirdPartyRequest(provider);
	};

	return {
		execute
	};
};
