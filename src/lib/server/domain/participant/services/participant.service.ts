import type { ServiceContext } from '$domain/@shared';
import type { ParticipantRepository } from '$domain/participant/spi/participant.repository';
import type { ParticipantFilters, ParticipantInput } from '../dtos';
import { makeCommonCrudService } from '$domain/@shared/services/crud.service';
import type { Participant } from '../models';
export type ParticipantServiceContext = ServiceContext & {
	repositories: {
		participantRepository: ParticipantRepository;
	};
};
export const ParticipantService = (context: ParticipantServiceContext) => {
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

export type ParticipantService = ReturnType<typeof ParticipantService>;
