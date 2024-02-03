import type { MaybePromise } from '$domain/@shared';
import type { Poll, SlotId } from '$domain/poll/models';

export type AvailabilityApi = {
	setAvailable: (slot: SlotId) => MaybePromise<Poll>;
	setUnavailable: (slot: SlotId) => MaybePromise<Poll>;
	setMaybeAvailable: (slot: SlotId) => MaybePromise<Poll>;
};
