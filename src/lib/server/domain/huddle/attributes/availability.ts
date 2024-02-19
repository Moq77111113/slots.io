import type { User, UserId } from '#/domain/user/models';

export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

/**
 * Represents the availability of a user for a specific slot.
 */
export type Availability = {
	userId: UserId;
	user?: User;
	status: AvailabilityStatus;
};
