import { ParticipantService } from '$application/actions/participant';
import { InMemoryParticipantRepository } from '$infrastructure';

export type SharedContext = Record<string, never>;

export type AppContext = {
	/**
	 * @description
	 * This is a shared context that is available to all actions.
	 */
	shared: SharedContext;
	/**
	 * @description
	 * This is a service context that is available to all actions.
	 */
	services: {
		participant: ParticipantService;
	};
};

export const initContext = () => {
	const shared = {};
	const participantRepository = InMemoryParticipantRepository();

	const participantService = ParticipantService({
		shared,
		repositories: {
			participantRepository
		}
	});

	return {
		shared: {},
		services: {
			participant: participantService
		}
	} satisfies AppContext;
};
