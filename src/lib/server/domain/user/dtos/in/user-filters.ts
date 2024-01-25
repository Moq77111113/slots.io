import type { Language } from '$domain/@shared';
import type { PaginationFilters } from '$domain/@shared/types';
import type { UserStatus } from '$domain/user/attributes';

export type UserFilters = PaginationFilters & {
	status?: UserStatus;
	language?: Language['code'];
};
