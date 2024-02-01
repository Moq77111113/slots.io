import type { MaybePromise } from '$domain/@shared';
import type { CreatePollDto } from '$domain/poll/dto/in/poll-input';
import type { Poll } from '$domain/poll/models';

export type CreatePollApi = {
	create: (args: CreatePollDto) => MaybePromise<Poll>;
};
