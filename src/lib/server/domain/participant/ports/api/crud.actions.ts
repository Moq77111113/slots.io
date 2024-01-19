import type { Action, Paginated } from '$domain/@shared';
import type { Participant } from '$domain/participant/models';
import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';

// TODO: Temporary solution, well create DDD actions instead of crud actions
type FindParticipantAction = Action<[id: string], Participant | null>;
type FindParticipantsAction = Action<[filters: ParticipantFilters], Paginated<Participant>>;
type CreateParticipantAction = Action<[input: ParticipantInput], Participant>;
type UpdateParticipantAction = Action<[id: string, input: ParticipantInput], Participant>;
type RemoveParticipantAction = Action<[id: string], Participant>;
type PatchParticipantAction = Action<[id: string, input: Partial<ParticipantInput>], Participant>;

export type {
	FindParticipantAction,
	FindParticipantsAction,
	CreateParticipantAction,
	UpdateParticipantAction,
	RemoveParticipantAction,
	PatchParticipantAction
};
