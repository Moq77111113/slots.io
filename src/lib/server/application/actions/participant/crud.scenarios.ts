import type { ActionAdapter } from '$domain/@shared';
import type { AppContext } from '$application/context';
import type { FindParticipantAction } from '$domain/participant/ports/api';
import type {
	CreateParticipantAction,
	FindParticipantsAction,
	PatchParticipantAction,
	RemoveParticipantAction,
	UpdateParticipantAction
} from '$domain/participant/ports/api/crud.actions';
import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';

const createAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantActions }
	} = ctx;

	return {
		execute: async (input: ParticipantInput) => participantActions.create(input)
	};
}) satisfies ActionAdapter<CreateParticipantAction, AppContext>;

const findOneAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;
	return {
		execute: async (id: string) => participantService.findOne(id)
	};
}) satisfies ActionAdapter<FindParticipantAction, AppContext>;

const findAllAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (input?: ParticipantFilters) => participantService.findAll(input)
	};
}) satisfies ActionAdapter<FindParticipantsAction, AppContext>;

const updateAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: ParticipantInput) => participantService.update(id, input)
	};
}) satisfies ActionAdapter<UpdateParticipantAction, AppContext>;

const patchAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: Partial<ParticipantInput>) =>
			participantService.patch(id, input)
	};
}) satisfies ActionAdapter<PatchParticipantAction, AppContext>;

const removeAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string) => participantService.remove(id)
	};
}) satisfies ActionAdapter<RemoveParticipantAction, AppContext>;

export { createAction, findOneAction, findAllAction, patchAction, updateAction, removeAction };
