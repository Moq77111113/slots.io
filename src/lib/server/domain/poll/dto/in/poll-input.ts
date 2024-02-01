import type { CreateEntityInput } from '$domain/@shared/types';
import type { Poll } from '$domain/poll/models';

export type CreatePollDto = Omit<CreateEntityInput<Poll>, 'creatorId' | 'participantIds'>;
