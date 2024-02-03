import type { CreatePollApi } from './poll.create';
import type { SlotApi } from './poll.slots';
export type { CreatePollApi, SlotApi };
export type PollApi = CreatePollApi & SlotApi;
