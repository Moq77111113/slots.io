import type { Scenario, Paginated } from '$domain/@shared';
import type { Participant } from '$domain/participant/models';
import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';

type FindParticipantScenario = Scenario<[id: string], Participant | null>;
type FindParticipantsScenario = Scenario<[filters: ParticipantFilters], Paginated<Participant>>;
type CreateParticipantScenario = Scenario<[input: ParticipantInput], Participant>;
type UpdateParticipantScenario = Scenario<[id: string, input: ParticipantInput], Participant>;
type RemoveParticipantScenario = Scenario<[id: string], Participant>;
type PatchParticipantScenario = Scenario<
	[id: string, input: Partial<ParticipantInput>],
	Participant
>;

export type {
	FindParticipantScenario,
	FindParticipantsScenario,
	CreateParticipantScenario,
	UpdateParticipantScenario,
	RemoveParticipantScenario,
	PatchParticipantScenario
};
