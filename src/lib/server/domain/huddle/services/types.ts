import type { ActionContext } from '#/domain/@shared';
import type { HuddleRepository } from '#/domain/huddle/ports/spi';
import type { MeApi } from '#/domain/user/ports/api/user.api';

export type HuddleServiceContext = ActionContext & {
	apis: {
		meApi: MeApi;
	};
	repositories: {
		huddle: HuddleRepository;
	};
};
