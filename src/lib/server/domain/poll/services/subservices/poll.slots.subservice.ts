import { DomainErrors } from '$domain/@shared/errors';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { PollId, SlotId } from '$domain/poll/models';
import type { PollSlotsApi } from '$domain/poll/ports/api/poll.slots';

import type { PollServiceContext } from '../types';

export const PollAddSlotSubService = (context: PollServiceContext): PollSlotsApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { slot: slotRepo, poll: pollRepo } = context.repositories;

	/**
	 *
	 * @description Asserts that the time range is valid
	 * By default, the range is 1 hour
	 */
	const assertMinimumTimeRange = (
		{ start, end }: { start: Date; end: Date },
		rangeInMs = 1000 * 60 * 60
	) => {
		const diff = end.getTime() - start.getTime();
		if (diff < rangeInMs) {
			throw errorHandler.throws(DomainErrors.Poll.bad_time_range);
		}
	};

	/**
	 *
	 * @description Asserts that the new slot does not overlap with any of the existing slots
	 *
	 */
	const assertSlotsDoesNotOverlaps = (
		slots: CreateSlotDto[],
		newSlot: CreateSlotDto,
		allowAdjacent = true
	) => {
		const { start, end } = newSlot;
		if (!slots.length) return;
		const overlapping = slots.some((slot) => {
			const slotStart = slot.start.getTime();
			const slotEnd = slot.end.getTime();
			const newStart = start.getTime();
			const newEnd = end.getTime();

			return allowAdjacent
				? // If adjacent slots are allowed, we consider two slots to be overlapping if the start of the new slot is within the existing slot or if the end of the new slot is within the existing slot.
					(newStart >= slotStart && newStart < slotEnd) || (newEnd > slotStart && newEnd <= slotEnd)
				: // If adjacent slots are not allowed, we consider two slots to be overlapping even if the start or end of the new slot is exactly the same as the end or start of the existing slot, respectively.
					(newStart >= slotStart && newStart <= slotEnd) ||
						(newEnd >= slotStart && newEnd <= slotEnd);
		});
		if (overlapping) {
			throw errorHandler.throws(DomainErrors.Poll.slots_overlapping([newSlot, ...slots]));
		}
	};

	const add = async (pollId: PollId, args: CreateSlotDto) => {
		const me = await meApi.getMe();

		const poll = await pollRepo.findById(pollId);

		if (!poll) {
			throw errorHandler.throws(DomainErrors.Poll.not_found);
		}
		if (poll.creatorId !== me.id) {
			throw errorHandler.throws(DomainErrors.Poll.authorization_required);
		}

		const { start, end, availability } = args;

		if (start.getTime() >= end.getTime()) {
			throw errorHandler.throws(DomainErrors.Poll.bad_time_range);
		}

		assertMinimumTimeRange(args);

		const { slots } = poll;

		assertSlotsDoesNotOverlaps(slots, args);

		const availabilities = availability ? [{ ...availability, userId: me.id }] : [];
		const slot = await slotRepo.create({ start, end, availabilities, pollId });

		return {
			...poll,
			slots: [...slots, slot]
		};
	};

	const remove = async (pollId: PollId, slotId: SlotId) => {
		const me = await meApi.getMe();

		const poll = await pollRepo.findById(pollId);

		if (!poll) {
			throw errorHandler.throws(DomainErrors.Poll.not_found);
		}
		if (poll.creatorId !== me.id) {
			throw errorHandler.throws(DomainErrors.Poll.authorization_required);
		}

		const { slots } = poll;

		const slot = slots.find((s) => s.id === slotId);

		if (!slot) {
			throw errorHandler.throws(DomainErrors.Poll.slot_not_found);
		}

		await slotRepo.remove(slotId);
		const slotIndex = slots.findIndex((s) => s.id === slotId);
		const newSlots = slots.filter((_, i) => i !== slotIndex);
		return {
			...poll,
			slots: newSlots
		};
	};

	return {
		add,
		remove
	};
};
