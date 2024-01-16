import type { ParticipantActionContext } from './index';

export const findOneAction = (ctx: ParticipantActionContext) => {
	const {
		repositories: { participantRepository }
	} = ctx;
	return {
		execute: async (id: string) => participantRepository.findOne(id)
	};
};
