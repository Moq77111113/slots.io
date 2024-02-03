import type { AvailabilityApi } from './poll.availabilities';
import type { CreatePollApi } from './poll.create';
import type { SlotApi } from './poll.slots';
export type { CreatePollApi, SlotApi, AvailabilityApi };
export type PollApi = CreatePollApi & SlotApi & AvailabilityApi;
