import type { ServiceContext } from '$domain/@shared';
import type { ParticipantRepository } from '$domain/participant/spi/participant.repository';
export type ParticipantServiceContext = ServiceContext & {
	repositories: {
		participantRepository: ParticipantRepository;
	};
};
export const ParticipantService = (context: ParticipantServiceContext) => {
	const { repositories } = context;

	const findOne = async (id: string) => {
		// Some logic

		return repositories.participantRepository.findOne(id);
	};
	return {
		findOne
	};
};

export type ParticipantService = ReturnType<typeof ParticipantService>;
