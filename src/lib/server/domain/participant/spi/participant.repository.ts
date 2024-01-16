import type { Repository } from '$domain/@shared';
import type { Participant } from '$domain/participant/models';
import type { ParticipantInput, ParticipantFilters } from '$domain/participant/dtos';

export type ParticipantRepository = Repository<Participant, ParticipantInput, ParticipantFilters>;
