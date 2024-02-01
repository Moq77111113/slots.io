import type { CreateEntityInput } from '$domain/@shared/types';
import { makePollId, type Poll } from '$domain/poll/models';
import type { PollRepository } from '$domain/poll/ports/spi';

export const MockedPollRepository = (): PollRepository => {
	const polls: Poll[] = [];

	const create = (_poll: CreateEntityInput<Poll>) => {
		const poll = {
			..._poll,
			id: makePollId((polls.length + 1).toString()),
			createdAt: new Date(),
			updatedAt: new Date()
		};
		polls.push(poll);
		return poll;
	};

	return {
		create
	};
};
