import type { ActionContext } from '$domain/@shared';
import type { PollRepository } from '$domain/poll/ports/spi';
import type { MeApi } from '$domain/user/ports/api/user.api';

export type PollServiceContext = ActionContext & {
	apis: {
		meApi: MeApi;
	};
	repositories: {
		poll: PollRepository;
	};
};
