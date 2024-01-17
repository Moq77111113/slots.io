import type { BaseEntity } from '$domain/@shared';
import type { ParticipantType } from '$domain/participant/types/participant-type.type';

type Participant = BaseEntity & {
	name: string;
	type: ParticipantType;
	scheduleId: string;
};

export type { Participant };
