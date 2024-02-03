import type { AvailabilityApi } from './huddle.availabilities';
import type { CreateHuddleApi } from './huddle.create';
import type { SlotApi } from './huddle.slots';
export type { CreateHuddleApi, SlotApi, AvailabilityApi };
export type HuddleApi = CreateHuddleApi & SlotApi & AvailabilityApi;
