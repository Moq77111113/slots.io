export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

/**
 * Represents the availability of a user for a specific slot.
 */
export type Availability = {
	userId: unknown; //TODO replace by userId;
	status: AvailabilityStatus;
};
