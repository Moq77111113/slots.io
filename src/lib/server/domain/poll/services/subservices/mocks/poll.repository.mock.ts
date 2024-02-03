import { makePollId, makeSlotId, type Poll, type PollId, type SlotId } from '$domain/poll/models';
import type { PollCreateArgs, PollRepository, SlotAddArgs } from '$domain/poll/ports/spi';

export const MockedPollRepository = (): PollRepository => {
	const polls: Poll[] = [];
	const create = (_poll: PollCreateArgs) => {
		const pollId = makePollId((polls.length + 1).toString());

		const poll = {
			..._poll,
			id: pollId,
			createdAt: new Date(),
			updatedAt: new Date(),
			slots: [],
			participantIds: []
		};
		polls.push(poll);

		return poll;
	};

	const findById = (id: string) => {
		return polls.find((poll) => poll.id === id) ?? null;
	};

	const addSlot = (pollId: PollId, slot: SlotAddArgs) => {
		const poll = findById(pollId);

		if (!poll) {
			throw new Error('Poll not found');
		}
		const newSlot = {
			...slot,
			id: makeSlotId((poll.slots.length + 1).toString()),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		poll.slots.push(newSlot);
		return poll;
	};

	const removeSlot = (pollId: PollId, slotId: SlotId) => {
		const poll = findById(pollId);

		if (!poll) {
			throw new Error('Poll not found');
		}
		const index = poll.slots.findIndex((_) => _.id === slotId);
		if (index === -1) {
			throw new Error('Slot not found');
		}
		poll.slots.splice(index, 1);
		return poll;
	};
	return {
		create,
		findById,
		addSlot,
		removeSlot
	};
};
