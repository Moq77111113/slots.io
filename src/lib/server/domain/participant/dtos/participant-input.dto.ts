import type { ParticipantType } from '$domain/participant/types/participant-type.type';

export type ParticipantInput = {
	name: string;
	eventId: string;
	type: ParticipantType;
	scheduleId: string;
};
