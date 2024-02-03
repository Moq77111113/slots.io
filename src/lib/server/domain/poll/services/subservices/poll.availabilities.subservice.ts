import { DomainErrors } from '$domain/@shared/errors';
import type { Poll, SlotId } from '$domain/poll/models';
import type { AvailabilityApi } from '$domain/poll/ports/api';

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
	const setAvailable = async (slot: SlotId) => {
		const poll = await findPollOrThrow(slot);

		const me = await getAuthorizedUser(poll);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setUnavailable = async (slot: SlotId) => {
		const poll = await findPollOrThrow(slot);
		const me = await getAuthorizedUser(poll);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setMaybeAvailable = async (slot: SlotId) => {
		const poll = await findPollOrThrow(slot);
		const me = await getAuthorizedUser(poll);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	return {
		setAvailable,
		setUnavailable,
		setMaybeAvailable
	};
};
