import { CrudFilters } from "src/dto/crud-filters.dto";
import { CrudSorting } from "src/dto/crud-sorting.dto";

export function filterResult(filters: CrudFilters[], list: any) {
    var result = [];
    filters.forEach(filter => {
        if (filter.operator == 'eq') {
            result.push(list.filter(item => item[filter.field] == filter.value));
        }
        else if (filter.operator == 'ne') {
            result.push(list.filter(item => item[filter.field] != filter.value));
        }
        else if (filter.operator == 'lt') {
            result.push(list.filter(item => item[filter.field] < filter.value));
        }
        else if (filter.operator == 'gt') {
            result.push(list.filter(item => item[filter.field] > filter.value));
        }
        else if (filter.operator == 'lte') {
            result.push(list.filter(item => item[filter.field] <= filter.value));
        }
        else if (filter.operator == 'gte') {
            result.push(list.filter(item => item[filter.field] >= filter.value));
        }
        else if (filter.operator == 'in') {
            result.push(list.filter(item => filter.value.includes(item[filter.field])));
        }
        else if (filter.operator == 'nin') {
            result.push(list.filter(item => !filter.value.includes(item[filter.field])));
        }
        else if (filter.operator == 'contains') {
            result.push(list.filter(item => item[filter.field].toLowerCase().includes(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'ncontains') {
            result.push(list.filter(item => !item[filter.field].toLowerCase().includes(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'containss') {
            result.push(list.filter(item => item[filter.field].includes(filter.value)));
        }
        else if (filter.operator == 'ncontainss') {
            result.push(list.filter(item => !item[filter.field].includes(filter.value)));
        }
        else if (filter.operator == 'between') {
            result.push(list.filter(item => item[filter.field] >= filter.value[0] && item[filter.field] <= filter.value[1]));
        }
        else if (filter.operator == 'nbetween') {
            result.push(list.filter(item => item[filter.field] < filter.value[0] || item[filter.field] > filter.value[1]));
        }
        else if (filter.operator == 'null') {
            result.push(list.filter(item => item[filter.field] == null));
        }
        else if (filter.operator == 'nnull') {
            result.push(list.filter(item => item[filter.field] != null));
        }
        else if (filter.operator == 'startswith') {
            result.push(list.filter(item => item[filter.field].toLowerCase().startsWith(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'nstartswith') {
            result.push(list.filter(item => !item[filter.field].toLowerCase().startsWith(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'startswiths') {
            result.push(list.filter(item => item[filter.field].startsWith(filter.value)));
        }
        else if (filter.operator == 'nstartswiths') {
            result.push(list.filter(item => !item[filter.field].startsWith(filter.value)));
        }
        else if (filter.operator == 'endswith') {
            result.push(list.filter(item => item[filter.field].toLowerCase().endsWith(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'nendswith') {
            result.push(list.filter(item => !item[filter.field].toLowerCase().endsWith(filter.value.toLowerCase())));
        }
        else if (filter.operator == 'endswiths') {
            result.push(list.filter(item => item[filter.field].endsWith(filter.value)));
        }
        else if (filter.operator == 'nendswiths') {
            result.push(list.filter(item => !item[filter.field].endsWith(filter.value)));
        }
    });
    return result;
}

/**
 * 
 * @param sort 
 * @param allClusterMetrics 
 * @returns 
 */
export function sortResult(sortingActions: CrudSorting[], list: any) {
    sortingActions.forEach(sort => {
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
        }
        else {
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