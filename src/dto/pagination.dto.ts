/**
 * Used to paginate the results of a query.
 * Current is the current item to retrieve (relates to position in array).
 * PageSize is the number of items per page.
 */
export class Pagination {
    current: number;
    pageSize: number;
}