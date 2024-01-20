import type { UserId } from '$domain/user/models';

export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

/**
 * Represents the availability of a user for a specific slot.
 */
export type Availability = {
	userId: UserId;
	status: AvailabilityStatus;
};
