import { DomainErrors } from '$domain/@shared/errors';
import type { CreatePollDto } from '$domain/poll/dto/in/poll-input';
import type { CreateSlotDto } from '$domain/poll/dto/in/slot-input';
import type { CreatePollApi } from '$domain/poll/ports/api/poll.create';

import type { PollServiceContext } from '../types';

export const PollCreateSubService = (context: PollServiceContext): CreatePollApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { poll } = context.repositories;

	/**
	 *
	 * @description Asserts that the slots does not overlaps
	 */
	const assertSlotsDoesNotOverlaps = (slots: CreateSlotDto[], allowAdjacent = true) => {
		const sorted = slots.sort((a, b) => a.start.getTime() - b.start.getTime());

		for (let i = 0; i < sorted.length - 1; i++) {
			const currentEnd = sorted[i].end.getTime();
			const nextStart = sorted[i + 1].start.getTime();

			const overlapping = allowAdjacent ? currentEnd > nextStart : currentEnd >= nextStart;

			if (overlapping)
				throw errorHandler.throws(DomainErrors.Poll.slots_overlapping([sorted[i], sorted[i + 1]]));
		}
	};

	const create = async (args: CreatePollDto) => {
		const me = await meApi.getMe(); // Find a way to secure the action so it's not necessary to check if me is defined here

		const { title, description, expiration, slots } = args;

		if (title.length > 100) {
			throw errorHandler.throws(DomainErrors.Poll.title_too_long);
		}

		if (description && description.length > 255) {
			throw errorHandler.throws(DomainErrors.Poll.description_too_long);
		}

		assertSlotsDoesNotOverlaps(slots);

		const formattedSlots = slots.map(({ start, end, availability }) => ({
			start,
			end,
			availabilities: availability ? [{ ...availability, userId: me.id }] : []
		}));
		return poll.create({
			title: title.trim(),
			description: description?.trim(),
			expiration,
			creatorId: me.id,
			participantIds: [],
			locked: false,
			slots: formattedSlots
		});
	};

	return {
		create
	};
};
