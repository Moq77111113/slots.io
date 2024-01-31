/**
 * @description Represent a paginated list of items.
 *
 */
export interface Paginated<T> {
	data: T[];
	total: number;
	page: number;
	itemsPerPage: number;
}

/**
 * @description Represent the filters to paginate a list of items.
 */
export interface PaginationFilters {
	page?: number;
	itemsPerPage?: number;
}
