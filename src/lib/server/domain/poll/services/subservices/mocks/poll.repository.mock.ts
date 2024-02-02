import { makePollId, type Poll } from '$domain/poll/models';
import type { PollCreateArgs, PollRepository } from '$domain/poll/ports/spi';

export const MockedPollRepository = (): PollRepository => {
	const polls: Poll[] = [];

	const create = (_poll: PollCreateArgs) => {
		const pollId = makePollId((polls.length + 1).toString());

		const poll = {
			..._poll,
			id: pollId,
			createdAt: new Date(),
			updatedAt: new Date(),
			slots: []
		};
		polls.push(poll);
		return poll;
	};

	const findById = (id: string) => {
		return polls.find((poll) => poll.id === id) ?? null;
	};
	return {
		create,
		findById
	};
};
