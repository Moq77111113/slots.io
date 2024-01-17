export interface Paginated<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export interface PaginationFilters {
	page?: number;
	limit?: number;
}
