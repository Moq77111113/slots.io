import type { ActionContext } from '$domain/@shared';
import type { ParticipantRepository } from '$domain/participant/ports/spi/participant.repository';
import type { ParticipantFilters, ParticipantInput } from '../dtos';
import { makeCommonCrudService } from '$domain/@shared/utils/crud.service';
import type { Participant } from '$domain/participant/models';

export type ParticipantActionsContext = ActionContext & {
	repositories: {
		participantRepository: ParticipantRepository;
	};
};
export const ParticipantActions = (context: ParticipantActionsContext) => {
	const { repositories } = context;

	const { findOne, findAll, patch, create, update, remove } = makeCommonCrudService<
		ParticipantRepository,
		Participant,
		ParticipantInput,
		ParticipantFilters
	>(repositories.participantRepository);

	return {
		create,
		findOne,
		findAll,
		update,
		patch,
		remove
	};
};

export type ParticipantActions = ReturnType<typeof ParticipantActions>;
