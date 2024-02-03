import { DomainErrors } from '$domain/@shared/errors';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { PollId, SlotId } from '$domain/poll/models';
import type { SlotApi } from '$domain/poll/ports/api/poll.slots';

import type { PollServiceContext } from '../types';

export const SlotSubService = (context: PollServiceContext): SlotApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { poll: pollRepo } = context.repositories;

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
	 * @description Checks if a date is within the range of two dates
	 */
	const overlaps = (
		{ start, end }: { start: Date; end: Date },
		date: Date,
		allowAdjacent = true
	) => (allowAdjacent ? date > start && date < end : date >= start && date <= end);
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
			return (
				overlaps({ start, end }, slot.start, allowAdjacent) ||
				overlaps({ start, end }, slot.end, allowAdjacent) ||
				overlaps({ start: slot.start, end: slot.end }, start, allowAdjacent) ||
				overlaps({ start: slot.start, end: slot.end }, end, allowAdjacent)
			);
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
		return await pollRepo.addSlot(pollId, { start, end, availabilities });
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

		return await pollRepo.removeSlot(pollId, slotId);
	};

	return {
		addSlot: add,
		removeSlot: remove
	};
};
