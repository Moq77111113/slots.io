import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput, Prettify } from '$domain/@shared/types';
import type { Poll } from '$domain/poll/models';

export type PollCreateArgs = Prettify<Omit<CreateEntityInput<Poll>, 'slots'>>;

type PollQuery = {
	findById: (id: string) => MaybePromise<Poll | null>;
};

type PollCommand = {
	create: (args: PollCreateArgs) => MaybePromise<Poll>;
};

export type PollRepository = PollCommand & PollQuery;
