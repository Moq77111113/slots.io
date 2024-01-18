import type { ScenarioAdapter } from '$domain/@shared';
import type { AppContext } from '$application/context';
import type { FindParticipantScenario } from '$domain/participant/ports/api';
import type {
	CreateParticipantScenario,
	FindParticipantsScenario,
	PatchParticipantScenario,
	RemoveParticipantScenario,
	UpdateParticipantScenario
} from '$domain/participant/ports/api/crud.scenarios';
import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';

const createScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantScenarios }
	} = ctx;

	return {
		execute: async (input: ParticipantInput) => participantScenarios.create(input)
	};
}) satisfies ScenarioAdapter<CreateParticipantScenario, AppContext>;

const findOneScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;
	return {
		execute: async (id: string) => participantService.findOne(id)
	};
}) satisfies ScenarioAdapter<FindParticipantScenario, AppContext>;

const findAllScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (input?: ParticipantFilters) => participantService.findAll(input)
	};
}) satisfies ScenarioAdapter<FindParticipantsScenario, AppContext>;

const updateScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: ParticipantInput) => participantService.update(id, input)
	};
}) satisfies ScenarioAdapter<UpdateParticipantScenario, AppContext>;

const patchScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: Partial<ParticipantInput>) =>
			participantService.patch(id, input)
	};
}) satisfies ScenarioAdapter<PatchParticipantScenario, AppContext>;

const removeScenario = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string) => participantService.remove(id)
	};
}) satisfies ScenarioAdapter<RemoveParticipantScenario, AppContext>;

export {
	createScenario,
	findOneScenario,
	findAllScenario,
	patchScenario,
	updateScenario,
	removeScenario
};
