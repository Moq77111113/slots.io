import type { ParticipantType } from '$domain/participant/types/participant-type.type';

type Participant = {
	id: string;
	name: string;
	eventId: string;
	type: ParticipantType;
	scheduleId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type { Participant };
