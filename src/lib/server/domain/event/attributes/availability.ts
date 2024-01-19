export type AvailabilityStatus = 'available' | 'unavailable' | 'maybe';

/**
 * Represents the availability of a user for a specific slot.
 */
export type Availability = {
	userId: string;
	status: AvailabilityStatus;
};
