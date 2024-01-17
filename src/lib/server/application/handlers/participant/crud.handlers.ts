import type { ActionImplementation } from '$domain/@shared';
import type { AppContext } from '$domain/@shared/context';
import type { FindParticipantAction } from '$domain/participant/api';
import type {
	CreateParticipantAction,
	FindParticipantsAction,
	PatchParticipantAction,
	RemoveParticipantAction,
	UpdateParticipantAction
} from '$domain/participant/api/crud.actions';
import type { ParticipantFilters, ParticipantInput } from '$domain/participant/dtos';

const createAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (input: ParticipantInput) => participantService.create(input)
	};
}) satisfies ActionImplementation<CreateParticipantAction, AppContext>;

const findOneAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;
	return {
		execute: async (id: string) => participantService.findOne(id)
	};
}) satisfies ActionImplementation<FindParticipantAction, AppContext>;

const findAllAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (input: ParticipantFilters) => participantService.findAll(input)
	};
}) satisfies ActionImplementation<FindParticipantsAction, AppContext>;

const updateAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: ParticipantInput) => participantService.update(id, input)
	};
}) satisfies ActionImplementation<UpdateParticipantAction, AppContext>;

const patchAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string, input: Partial<ParticipantInput>) =>
			participantService.patch(id, input)
	};
}) satisfies ActionImplementation<PatchParticipantAction, AppContext>;

const removeAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;

	return {
		execute: async (id: string) => participantService.remove(id)
	};
}) satisfies ActionImplementation<RemoveParticipantAction, AppContext>;

export { createAction, findOneAction, findAllAction, patchAction, updateAction, removeAction };
