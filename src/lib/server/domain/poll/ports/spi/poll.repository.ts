import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput } from '$domain/@shared/types';
import type { Poll } from '$domain/poll/models';

export type PollCommand = {
	create: (args: CreateEntityInput<Poll>) => MaybePromise<Poll>;
};

export type PollRepository = PollCommand;
