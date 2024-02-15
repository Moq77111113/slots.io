import type { Availability } from '$domain/huddle/attributes';

export type SetAvailabilityDto = Omit<Availability, 'userId' | 'user'>;
