import type { MaybePromise } from '@sveltejs/kit';

import type { CreateEntityInput, Prettify } from '$domain/@shared/types';
import type { Poll, Slot } from '$domain/poll/models';

export type PollCreateCommand = Prettify<
	Omit<CreateEntityInput<Poll>, 'slots'> & { slots: Prettify<CreateEntityInput<Slot>>[] }
>;
export type PollCommand = {
	create: (args: PollCreateCommand) => MaybePromise<Poll>;
};

export type PollRepository = PollCommand;
