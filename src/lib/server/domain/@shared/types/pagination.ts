export interface Paginated<T> {
	data: T[];
	total: number;
	page: number;
	itemsPerPage: number;
}

export interface PaginationFilters {
	page?: number;
	itemsPerPage?: number;
}
