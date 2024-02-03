import type { MaybePromise } from '$domain/@shared';
import type { CreateHuddleDto } from '$domain/huddle/dto/in/huddle.input';
import type { Huddle } from '$domain/huddle/models';

export type CreateHuddleApi = {
	create: (args: CreateHuddleDto) => MaybePromise<Huddle>;
};
