import { DomainErrors } from '$domain/@shared/errors';
import type { CreateHuddleDto } from '$domain/huddle/dto/in/huddle.input';
import type { CreateSlotDto } from '$domain/huddle/dto/in/slot.input';
import type { Huddle } from '$domain/huddle/models';
import type { CreateHuddleApi } from '$domain/huddle/ports/api/huddle.create';

import type { HuddleServiceContext } from '../types';

export const HuddleCreateSubService = (context: HuddleServiceContext): CreateHuddleApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { huddle } = context.repositories;

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
				throw errorHandler.throws(
					DomainErrors.Huddle.slots_overlapping([sorted[i], sorted[i + 1]])
				);
		}
	};

	const create = async (args: CreateHuddleDto) => {
		const me = await meApi.getMe(); // Find a way to secure the action so it's not necessary to check if me is defined here

		const { title, description, expiration, slots } = args;

		if (title.length > 100) {
			throw errorHandler.throws(DomainErrors.Huddle.title_too_long);
		}

		if (description && description.length > 255) {
			throw errorHandler.throws(DomainErrors.Huddle.description_too_long);
		}

		assertSlotsDoesNotOverlaps(slots);

		const formattedSlots = slots.map(({ start, end, availability }) => ({
			start,
			end,
			availabilities: availability ? [{ ...availability, userId: me.id }] : []
		}));

		const created = await huddle.create({
			title: title.trim(),
			description: description?.trim(),
			expiration,
			creatorId: me.id,
			locked: false
		});

		if (!formattedSlots.length) return created;

		const withSlot = await Promise.all<Huddle>(
			formattedSlots.map((_) => huddle.addSlot(created.id, { ..._ }))
		);

		return withSlot[withSlot.length - 1];
	};

	return { create };
};
