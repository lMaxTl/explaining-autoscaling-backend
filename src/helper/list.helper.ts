import { CrudFilters } from 'src/dto/crud-filters.dto';
import { CrudSorting } from 'src/dto/crud-sorting.dto';

/**
 * Filters a list of objects based on the given filters.
 *
 * @param filters
 * @param list
 * @returns
 */
export function filterResult(filters: CrudFilters[], list: any) {
  let result = list;
  filters.forEach((filter) => {
    if (filter.operator == 'eq') {
      result = result.filter((item) => item[filter.field] == filter.value);
    } else if (filter.operator == 'ne') {
      result = result.filter((item) => item[filter.field] != filter.value);
    } else if (filter.operator == 'lt') {
      result = result.filter((item) => item[filter.field] < filter.value);
    } else if (filter.operator == 'gt') {
      result = result.filter((item) => item[filter.field] > filter.value);
    } else if (filter.operator == 'lte') {
      result = result.filter((item) => item[filter.field] <= filter.value);
    } else if (filter.operator == 'gte') {
      result = result.filter((item) => item[filter.field] >= filter.value);
    } else if (filter.operator == 'in') {
      result = result.filter((item) =>
        filter.value.includes(item[filter.field]),
      );
    } else if (filter.operator == 'nin') {
      result = result.filter(
        (item) => !filter.value.includes(item[filter.field]),
      );
    } else if (filter.operator == 'contains') {
      result = result.filter((item) =>
        item[filter.field].toLowerCase().includes(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'ncontains') {
      result = result.filter(
        (item) =>
          !item[filter.field]
            .toLowerCase()
            .includes(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'containss') {
      result = result.filter((item) =>
        item[filter.field].includes(filter.value),
      );
    } else if (filter.operator == 'ncontainss') {
      result = result.filter(
        (item) => !item[filter.field].includes(filter.value),
      );
    } else if (filter.operator == 'between') {
      result = result.filter(
        (item) =>
          item[filter.field] >= filter.value[0] &&
          item[filter.field] <= filter.value[1],
      );
    } else if (filter.operator == 'nbetween') {
      result = result.filter(
        (item) =>
          item[filter.field] < filter.value[0] ||
          item[filter.field] > filter.value[1],
      );
    } else if (filter.operator == 'null') {
      result = result.filter((item) => item[filter.field] == null);
    } else if (filter.operator == 'nnull') {
      result = result.filter((item) => item[filter.field] != null);
    } else if (filter.operator == 'startswith') {
      result = result.filter((item) =>
        item[filter.field].toLowerCase().startsWith(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'nstartswith') {
      result = result.filter(
        (item) =>
          !item[filter.field]
            .toLowerCase()
            .startsWith(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'startswiths') {
      result = result.filter((item) =>
        item[filter.field].startsWith(filter.value),
      );
    } else if (filter.operator == 'nstartswiths') {
      result = result.filter(
        (item) => !item[filter.field].startsWith(filter.value),
      );
    } else if (filter.operator == 'endswith') {
      result = result.filter((item) =>
        item[filter.field].toLowerCase().endsWith(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'nendswith') {
      result = result.filter(
        (item) =>
          !item[filter.field]
            .toLowerCase()
            .endsWith(filter.value.toLowerCase()),
      );
    } else if (filter.operator == 'endswiths') {
      result = result.filter((item) =>
        item[filter.field].endsWith(filter.value),
      );
    } else if (filter.operator == 'nendswiths') {
      result = result.filter(
        (item) => !item[filter.field].endsWith(filter.value),
      );
    }
  });
  return result;
}

/**
 * Sorts a list of objects based on the given sorting actions.
 *
 * @param sort
 * @param allClusterMetrics
 * @returns
 */
export function sortResult(sortingActions: CrudSorting[], list: any) {
  sortingActions.forEach((sort) => {
    if (sort.order === 'asc') {
      list = list.sort((a, b) => {
        if (a[sort.field] < b[sort.field]) {
          return -1;
        }
        if (a[sort.field] > b[sort.field]) {
          return 1;
        }
        return 0;
      });
    } else {
      list = list.sort((a, b) => {
        if (a[sort.field] > b[sort.field]) {
          return -1;
        }
        if (a[sort.field] < b[sort.field]) {
          return 1;
        }
        return 0;
      });
    }
  });
  return list;
}
