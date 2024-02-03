import type { Availability } from '$domain/poll/attributes';

export type SetAvailabilityDto = Omit<Availability, 'userId'>;
