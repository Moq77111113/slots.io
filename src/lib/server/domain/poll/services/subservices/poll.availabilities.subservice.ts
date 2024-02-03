import { DomainErrors } from '$domain/@shared/errors';
import type { Poll, SlotId } from '$domain/poll/models';
import type { AvailabilityApi } from '$domain/poll/ports/api';
import type { AvailabilityAddArgs } from '$domain/poll/ports/spi';

import type { PollServiceContext } from '../types';

export const AvailabilitySubService = (context: PollServiceContext): AvailabilityApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { poll: pollRepo } = context.repositories;

	const findPollOrThrow = async (slot: SlotId) => {
		const poll = await pollRepo.findBySlotId(slot);
		if (!poll) {
			throw errorHandler.throws(DomainErrors.Poll.slot_not_found);
		}
		return poll;
	};

	const getAuthorizedUser = async (poll: Poll) => {
		const me = await meApi.getMe();
		if (![poll.creatorId, ...poll.participantIds].includes(me.id)) {
			throw errorHandler.throws(DomainErrors.Poll.not_member);
		}
		return me;
	};

	const replaceAvailability = async (slotId: SlotId, { userId, status }: AvailabilityAddArgs) => {
		await pollRepo.removeAvailability(slotId, { userId });
		return await pollRepo.addAvailability(slotId, { userId, status });
	};

	const setAvailable = async (slotId: SlotId) => {
		const poll = await findPollOrThrow(slotId);

		const me = await getAuthorizedUser(poll);

		return await replaceAvailability(slotId, { userId: me.id, status: 'available' });
	};

	const setUnavailable = async (slotId: SlotId) => {
		const poll = await findPollOrThrow(slotId);
		const me = await getAuthorizedUser(poll);

		return await replaceAvailability(slotId, { userId: me.id, status: 'unavailable' });
	};

	const setMaybeAvailable = async (slotId: SlotId) => {
		const poll = await findPollOrThrow(slotId);
		const me = await getAuthorizedUser(poll);
		return await replaceAvailability(slotId, { userId: me.id, status: 'maybe' });
	};

	return {
		setAvailable,
		setUnavailable,
		setMaybeAvailable
	};
};
