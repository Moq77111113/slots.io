import type { ActionContext } from '$application/actions/types';
import type { ParticipantRepository } from '$domain/participant/spi/participant.repository';
import { findOneAction } from './findOne.action';

export type ParticipantActionContext = ActionContext & {
	repositories: {
		participantRepository: ParticipantRepository;
	};
};
export const ParticipantService = (context: ParticipantActionContext) => {
	const findOne = findOneAction(context).execute;
	return {
		findOne
	};
};

export type ParticipantService = ReturnType<typeof ParticipantService>;
