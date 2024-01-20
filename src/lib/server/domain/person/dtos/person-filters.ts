import type { PaginationFilters } from '$domain/@shared/types';

export type PersonFilters = PaginationFilters & Record<string, never>;
