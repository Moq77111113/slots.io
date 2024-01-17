import type { ActionImplementation } from '$domain/@shared';
import type { AppContext } from '$domain/@shared/context';
import type { FindParticipantAction } from '$domain/participant/api';

export const findOneAction = ((ctx: AppContext) => {
	const {
		services: { participant: participantService }
	} = ctx;
	return {
		execute: async (id: string) => participantService.findOne(id)
	};
}) satisfies ActionImplementation<FindParticipantAction, AppContext>;
