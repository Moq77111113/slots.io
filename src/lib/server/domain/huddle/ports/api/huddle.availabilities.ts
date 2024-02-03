import type { MaybePromise } from '$domain/@shared';
import type { Huddle, SlotId } from '$domain/huddle/models';

export type AvailabilityApi = {
	setAvailable: (slot: SlotId) => MaybePromise<Huddle>;
	setUnavailable: (slot: SlotId) => MaybePromise<Huddle>;
	setMaybeAvailable: (slot: SlotId) => MaybePromise<Huddle>;
};
