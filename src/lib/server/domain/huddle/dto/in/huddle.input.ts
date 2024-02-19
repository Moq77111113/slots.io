import type { CreateEntityInput } from '#/domain/@shared/types';
import type { Huddle } from '#/domain/huddle/models';

import type { CreateSlotDto } from './slot.input';

export type CreateHuddleDto = Omit<
	CreateEntityInput<Huddle>,
	'creatorId' | 'participantIds' | 'locked' | 'slots'
> & { slots: CreateSlotDto[] };
