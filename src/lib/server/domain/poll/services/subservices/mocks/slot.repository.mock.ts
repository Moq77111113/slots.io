import { makeSlotId, type Slot, type SlotId } from '$domain/poll/models';
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

	const remove = (slotId: SlotId) => {
		const index = slots.findIndex((_) => _.id === slotId);
		if (index === -1) {
			throw new Error('Slot not found');
		}
		const slot = slots[index];

		slots.splice(index, 1);
		return slot;
	};

	return {
		create,
		remove
	};
};
