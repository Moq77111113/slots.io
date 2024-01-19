import type { Entity } from '$domain/@shared';
import type { ParticipantType } from '$domain/participant/types/participant-type.type';

type Participant = Entity<{
	name: string;
	type: ParticipantType;
	scheduleId: string;
}>;

export type { Participant };
