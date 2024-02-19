import { DomainErrors } from '#/domain/@shared/errors';
import type { Huddle, SlotId } from '#/domain/huddle/models';
import type { AvailabilityApi } from '#/domain/huddle/ports/api';
import type { AvailabilityAddArgs } from '#/domain/huddle/ports/spi';

import type { HuddleServiceContext } from '../types';

export const AvailabilitySubService = (context: HuddleServiceContext): AvailabilityApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { huddle: huddleRepo } = context.repositories;

	const findHuddleOrThrow = async (slot: SlotId) => {
		const huddle = await huddleRepo.findBySlotId(slot);
		if (!huddle) {
			throw errorHandler.throws(DomainErrors.Huddle.slot_not_found);
		}
		return huddle;
	};

	const getAuthorizedUser = async (huddle: Huddle) => {
		const me = await meApi.getMe();
		if (![huddle.creatorId, ...huddle.participantIds].includes(me.id)) {
			throw errorHandler.throws(DomainErrors.Huddle.not_member);
		}

		return me;
	};

	const replaceAvailability = async (slotId: SlotId, { userId, status }: AvailabilityAddArgs) => {
		await huddleRepo.removeAvailability(slotId, { userId });
		return await huddleRepo.addAvailability(slotId, { userId, status });
	};

	const setAvailable = async (slotId: SlotId) => {
		const huddle = await findHuddleOrThrow(slotId);

		const me = await getAuthorizedUser(huddle);

		return await replaceAvailability(slotId, { userId: me.id, status: 'available' });
	};

	const setUnavailable = async (slotId: SlotId) => {
		const huddle = await findHuddleOrThrow(slotId);
		const me = await getAuthorizedUser(huddle);

		return await replaceAvailability(slotId, { userId: me.id, status: 'unavailable' });
	};

	const setMaybeAvailable = async (slotId: SlotId) => {
		const huddle = await findHuddleOrThrow(slotId);
		const me = await getAuthorizedUser(huddle);
		return await replaceAvailability(slotId, { userId: me.id, status: 'maybe' });
	};

	return {
		setAvailable,
		setUnavailable,
		setMaybeAvailable
	};
};
