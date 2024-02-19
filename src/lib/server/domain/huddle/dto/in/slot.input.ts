import type { CreateEntityInput, Identity } from '#/domain/@shared/types';
import type { Slot } from '#/domain/huddle/models';

import type { SetAvailabilityDto } from './availability.input';

export type CreateSlotDto = Identity<
	Omit<CreateEntityInput<Slot>, 'availabilities'> & { availability?: SetAvailabilityDto }
>;
