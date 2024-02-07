import {
	type Huddle,
	type HuddleId,
	makeHuddleId,
	makeSlotId,
	type SlotId
} from '$domain/huddle/models';
import type {
	AvailabilityAddArgs,
	AvailabilityRemoveArgs,
	HuddleCreateArgs,
	HuddleRepository,
	SlotAddArgs
} from '$domain/huddle/ports/spi';

export const MockedHuddleRepository = (): HuddleRepository => {
	const huddles: Huddle[] = [];

	const create = (_huddle: HuddleCreateArgs) => {
		const huddleId = makeHuddleId((huddles.length + 1).toString());

		const huddle = {
			..._huddle,
			id: huddleId,
			createdAt: new Date(),
			updatedAt: new Date(),
			slots: [],
			participantIds: []
		};
		huddles.push(huddle);

		return huddle;
	};

	const findById = (id: string) => {
		return huddles.find((huddle) => huddle.id === id) ?? null;
	};

	const findBySlotId = (slotId: SlotId) => {
		return huddles.find((huddle) => huddle.slots.some((_) => _.id === slotId)) ?? null;
	};

	const addSlot = (huddleId: HuddleId, slot: SlotAddArgs) => {
		const huddle = findById(huddleId);

		if (!huddle) {
			throw new Error('Huddle not found');
		}
		const newSlot = {
			...slot,
			id: makeSlotId(`${huddle.id}-${(huddle.slots.length + 1).toString()}`),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		huddle.slots.push(newSlot);
		return huddle;
	};

	const removeSlot = (huddleId: HuddleId, slotId: SlotId) => {
		const huddle = findById(huddleId);

		if (!huddle) {
			throw new Error('Huddle not found');
		}
		const index = huddle.slots.findIndex((_) => _.id === slotId);
		if (index === -1) {
			throw new Error('Slot not found');
		}
		huddle.slots.splice(index, 1);
		return huddle;
	};

	const addAvailability = (slotId: SlotId, availability: AvailabilityAddArgs) => {
		const huddle = findBySlotId(slotId);
		if (!huddle) {
			throw new Error('Huddle not found');
		}
		const slot = huddle.slots.find((_) => _.id === slotId);
		if (!slot) {
			throw new Error('Slot not found');
		}
		slot.availabilities.push(availability);
		return huddle;
	};

	const removeAvailability = (slotId: SlotId, { userId }: AvailabilityRemoveArgs) => {
		const huddle = findBySlotId(slotId);
		if (!huddle) {
			throw new Error('Huddle not found');
		}
		const slot = huddle.slots.find((_) => _.id === slotId);
		if (!slot) {
			throw new Error('Slot not found');
		}
		slot.availabilities = slot.availabilities.filter((_) => _.userId !== userId);

		return huddle;
	};

	return {
		create,
		findById,
		findBySlotId,
		addSlot,
		removeSlot,
		addAvailability,
		removeAvailability
	};
};
