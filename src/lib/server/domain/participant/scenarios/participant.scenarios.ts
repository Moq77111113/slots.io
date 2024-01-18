import type { ScenariosContext } from '$domain/@shared';
import type { ParticipantRepository } from '$domain/participant/ports/spi/participant.repository';
import type { ParticipantFilters, ParticipantInput } from '../dtos';
import { makeCommonCrudService } from '$domain/@shared/utils/crud.service';
import type { Participant } from '$domain/participant/models';

export type ParticipantScenariosContext = ScenariosContext & {
	repositories: {
		participantRepository: ParticipantRepository;
	};
};
export const ParticipantScenarios = (context: ParticipantScenariosContext) => {
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

export type ParticipantScenarios = ReturnType<typeof ParticipantScenarios>;
