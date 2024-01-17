import type { Action } from '$domain/@shared';
import type { Participant } from '../models';

export interface FindParticipantAction extends Action<string, Participant | null> {}
