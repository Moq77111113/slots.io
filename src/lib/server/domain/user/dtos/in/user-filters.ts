import type { Language } from '$domain/@shared';
import type { PaginationFilters, Prettify } from '$domain/@shared/types';
import type { UserStatus } from '$domain/user/attributes';

/**
 * @description User filters
 */
export type UserFilters = Prettify<
	PaginationFilters & {
		status?: UserStatus;
		language?: Language['code'];
	}
>;
