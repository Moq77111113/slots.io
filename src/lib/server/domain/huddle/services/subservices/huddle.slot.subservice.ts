import { DomainErrors } from '$domain/@shared/errors';
import type { CreateSlotDto } from '$domain/huddle/dto/in/slot.input';
import type { HuddleId, SlotId } from '$domain/huddle/models';
import type { SlotApi } from '$domain/huddle/ports/api/huddle.slots';

import type { HuddleServiceContext } from '../types';

export const SlotSubService = (context: HuddleServiceContext): SlotApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { huddle: huddleRepo } = context.repositories;

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
			throw errorHandler.throws(DomainErrors.Huddle.bad_time_range);
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
			throw errorHandler.throws(DomainErrors.Huddle.slots_overlapping([newSlot, ...slots]));
		}
	};

	const add = async (huddleId: HuddleId, args: CreateSlotDto) => {
		const me = await meApi.getMe();

		const huddle = await huddleRepo.findById(huddleId);

		if (!huddle) {
			throw errorHandler.throws(DomainErrors.Huddle.not_found);
		}
		if (huddle.creatorId !== me.id) {
			throw errorHandler.throws(DomainErrors.Huddle.admin_required);
		}

		const { start, end, availability } = args;

		if (start.getTime() >= end.getTime()) {
			throw errorHandler.throws(DomainErrors.Huddle.bad_time_range);
		}

		assertMinimumTimeRange(args);

		const { slots } = huddle;

		assertSlotsDoesNotOverlaps(slots, args);

		const availabilities = availability ? [{ ...availability, userId: me.id }] : [];
		return await huddleRepo.addSlot(huddleId, { start, end, availabilities });
	};

	const remove = async (huddleId: HuddleId, slotId: SlotId) => {
		const me = await meApi.getMe();

		const huddle = await huddleRepo.findById(huddleId);

		if (!huddle) {
			throw errorHandler.throws(DomainErrors.Huddle.not_found);
		}
		if (huddle.creatorId !== me.id) {
			throw errorHandler.throws(DomainErrors.Huddle.admin_required);
		}

		const { slots } = huddle;

		const slot = slots.find((s) => s.id === slotId);

		if (!slot) {
			throw errorHandler.throws(DomainErrors.Huddle.slot_not_found);
		}

		return await huddleRepo.removeSlot(huddleId, slotId);
	};

	return {
		addSlot: add,
		removeSlot: remove
	};
};
