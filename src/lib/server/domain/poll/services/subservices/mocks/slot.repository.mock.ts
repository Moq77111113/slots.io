import { makeSlotId, type Slot } from '$domain/poll/models';
import type { SlotCreateArgs, SlotRepository } from '$domain/poll/ports/spi';

export const MockedSlotRepository = (): SlotRepository => {
	const slots: Slot[] = [];

	const create = (_slot: SlotCreateArgs) => {
		const pollId = makeSlotId((slots.length + 1).toString());

		const slot = {
			..._slot,
			id: pollId,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		slots.push(slot);
		return slot;
	};

	return {
		create
	};
};
