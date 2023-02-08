/**
 * Used to filter the results of a CRUD operation.
 * Field is the name of the field to filter.
 * Operator is the operator to use for the filter.
 * Value is the value to filter by.
 *
 * The operators are:
 *  |Type|Description|
 *  |-----------|-----------|
 *  |eq| Equal|
 *  |ne| Not Equal|
 *  |lt| Less Than|
 *  |gt| Greater Than|
 *  |lte| Less Than or Equal to|
 *  |gte| Greater Than or Equal to|
 *  |in| Included in an array|
 *  |nin| Not included in an array|
 *  |contains| Contains|
 *  |ncontains| Does not contain|
 *  |containss| Contains (case sensitive)|
 *  |ncontainss| Does not contain (case sensitive)|
 *  |between| Between|
 *  |nbetween| Not between|
 *  |null| Is null|
 *  |nnull| Is not null|
 *  |startswith| Starts with|
 *  |nstartswith| Does not start with|
 *  |startswiths| Starts with (case sensitive)|
 *  |nstartswiths| Does not start with (case sensitive)|
 *  |endswith| Ends with|
 *  |nendswith| Does not end with|
 *  |endswiths| Ends with (case sensitive)|
 *  |nendswiths| Does not end with (case sensitive)|
 *
 */
export class CrudFilters {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'lt'
    | 'gt'
    | 'lte'
    | 'gte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'ncontains'
    | 'containss'
    | 'ncontainss'
    | 'between'
    | 'nbetween'
    | 'null'
    | 'nnull'
    | 'startswith'
    | 'nstartswith'
    | 'startswiths'
    | 'nstartswiths'
    | 'endswith'
    | 'nendswith'
    | 'endswiths'
    | 'nendswiths';
  value: any;
}
