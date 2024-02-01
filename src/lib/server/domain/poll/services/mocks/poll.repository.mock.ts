import { makePollId, makeSlotId, type Poll, type Slot } from '$domain/poll/models';
import type { PollCreateCommand, PollRepository } from '$domain/poll/ports/spi';

export const MockedPollRepository = (): PollRepository => {
	const polls: Poll[] = [];

	const create = (_poll: PollCreateCommand) => {
		const pollId = makePollId((polls.length + 1).toString());

		const slots = _poll.slots.map((slot, idx) => ({
			id: makeSlotId(`${pollId}-${idx}`),
			...slot,
			createdAt: new Date(),
			updatedAt: new Date()
		})) satisfies Slot[];

		const poll = {
			..._poll,
			id: pollId,
			createdAt: new Date(),
			updatedAt: new Date(),
			slots
		};
		polls.push(poll);
		return poll;
	};

	return {
		create
	};
};
