import type { PaginationFilters } from '$domain/@shared/types';

export type ParticipantFilters = PaginationFilters & Record<string, never>;
