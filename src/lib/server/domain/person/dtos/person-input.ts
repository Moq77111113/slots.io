import type { UserId } from '$domain/user/models';

export type PersonInput = {
	name: string;
	email: string;
	userId?: UserId;
};
