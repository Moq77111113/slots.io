import type { Language } from '$domain/@shared';
import type { Identity, PaginationFilters } from '$domain/@shared/types';
import type { UserStatus } from '$domain/user/attributes';

/**
 * @description User filters
 */
export type UserFilters = Identity<
	PaginationFilters & {
		status?: UserStatus;
		language?: Language['code'];
	}
>;
