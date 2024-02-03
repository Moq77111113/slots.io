import { DomainErrors } from '$domain/@shared/errors';
import type { AvailabilityApi } from '$domain/poll/ports/api';

import type { PollServiceContext } from '../types';
export const AvailabilitySubService = (context: PollServiceContext): AvailabilityApi => {
	const { errorHandler } = context.shared;
	const { meApi } = context.apis;
	const { poll: pollRepo } = context.repositories;

	const setAvailable = (slot: SlotId) => {
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setUnavailable = (slot: SlotId) => {
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	const setMaybeAvailable = (slot: SlotId) => {
		throw errorHandler.throws(DomainErrors.Common.not_implemented);
	};

	return {
		setAvailable,
		setUnavailable,
		setMaybeAvailable
	};
};
