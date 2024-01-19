import { ParticipantActions } from '$domain/participant/actions/participant.actions';
import { InMemoryParticipantRepository } from '$infrastructure';

export type SharedContext = Record<string, never>;

/**
 * @description
 * This is the context that is available to all actions.
 *
 */
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
		participant: ParticipantActions;
	};
};

/**
 * @description This function creates a new context.
 * @returns AppContext
 */
// TODO : Use an IoC container to create the context with correct bindings.
export const initContext = () => {
	const shared = {};
	const participantRepository = InMemoryParticipantRepository();

	const participantService = ParticipantActions({
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
