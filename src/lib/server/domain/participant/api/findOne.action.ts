import type { Action, MaybePromise } from '$domain/@shared';
import type { Participant } from '../models';

export interface FindParticipantAction extends Action<string, Participant> {
	execute(id: string): MaybePromise<Participant>;
}
