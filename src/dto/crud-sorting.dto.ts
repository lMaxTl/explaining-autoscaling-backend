/**
 * Used to sort the results of a CRUD operation.
 * Field is the name of the field to sort by.
 * Order is the order to sort by.
 *
 * The orders are:
 * |Type|Description|
 * |-----------|-----------|
 * |asc| Ascending order|
 * |desc| Descending order|
 *
 */
export class CrudSorting {
  field: string;
  order: 'asc' | 'desc';
}
