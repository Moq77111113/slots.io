import type { MaybePromise } from '#/domain/@shared';
import type { Identity } from '#/domain/@shared/types';
import type { CreateSlotDto } from '#/domain/huddle/dto/in/slot.input';
import type { Huddle, HuddleId, SlotId } from '#/domain/huddle/models';

export type SlotApi = {
	addSlot: (huddle: HuddleId, args: Identity<CreateSlotDto>) => MaybePromise<Huddle>;
	removeSlot: (huddle: HuddleId, slotId: SlotId) => MaybePromise<Huddle>;
};
