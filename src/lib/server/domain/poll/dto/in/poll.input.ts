import type { CreateEntityInput } from '$domain/@shared/types';
import type { Poll } from '$domain/poll/models';

import type { CreateSlotDto } from './slot.input';

export type CreatePollDto = Omit<
	CreateEntityInput<Poll>,
	'creatorId' | 'participantIds' | 'locked' | 'slots'
> & { slots: CreateSlotDto[] };
