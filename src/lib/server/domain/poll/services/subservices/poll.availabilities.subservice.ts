import { DomainErrors } from '$domain/@shared/errors';
import type { SlotId } from '$domain/poll/models';
import type { AvailabilityApi } from '$domain/poll/ports/api';

import type { PollServiceContext } from '../types';
export const AvailabilitySubService = (context: PollServiceContext): AvailabilityApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { poll: pollRepo } = context.repositories;

	const assertSlotExists = async (slot: SlotId) => {
		const poll = await pollRepo.findBySlotId(slot);
		if (!poll) {
			throw errorHandler.throws(DomainErrors.Poll.slot_not_found);
		}
		return poll;
	};
	const setAvailable = async (slot: SlotId) => {
		const poll = await assertSlotExists(slot);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setUnavailable = async (slot: SlotId) => {
		const poll = await assertSlotExists(slot);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setMaybeAvailable = async (slot: SlotId) => {
		const poll = await assertSlotExists(slot);
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	return {
		setAvailable,
		setUnavailable,
		setMaybeAvailable
	};
};
