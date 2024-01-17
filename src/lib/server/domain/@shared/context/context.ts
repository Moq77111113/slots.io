import { ParticipantService } from '$domain/participant/services/participant.service';
import { InMemoryParticipantRepository } from '$infrastructure';

export type SharedContext = Record<string, never>;

/**
 * @description
 * This is the context that is available to all actions.
 *
 * @example
 * ```ts
 * const context = initContext();
 * const participant = await context.services.participant.findOne('123');
 * ```
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
		participant: ParticipantService;
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
