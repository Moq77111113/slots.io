import type { CreateEntityInput, Identity } from '$domain/@shared/types';
import type { Availability } from '$domain/poll/attributes';
import type { Slot } from '$domain/poll/models';

type AddAvailabilityDto = Omit<Availability, 'userId'>;

export type CreateSlotDto = Identity<
	Omit<CreateEntityInput<Slot>, 'availabilities'> & { availability?: AddAvailabilityDto }
>;
