import type { Language, ThirdPartyAccount } from '$domain/@shared/attributes';

import type { UsersResponse } from './pb-types';

type UserRelations = {
	thirdPartyAccounts: ThirdPartyAccount[];
};
type PocketBaseUser = UsersResponse<Language, string[], UserRelations>;

export type PocketBaseEntities = {
	User: PocketBaseUser;
};
