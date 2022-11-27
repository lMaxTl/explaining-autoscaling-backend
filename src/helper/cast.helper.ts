import { CrudFilters } from "src/dto/crud-filters.dto";
import { CrudSorting } from "src/dto/crud-sorting.dto";
import { Pagination } from "src/dto/pagination.dto";

interface ToNumberOptions {
    default?: number;
    min?: number;
    max?: number;
}

export function toLowerCase(value: string): string {
    return value.toLowerCase();
}

export function trim(value: string): string {
    return value.trim();
}

export function toDate(value: string): Date {
    return new Date(value);
}

export function toBoolean(value: string): boolean {
    value = value.toLowerCase();

    return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
    let newValue: number = Number.parseInt(value || String(opts.default), 10);

    if (Number.isNaN(newValue)) {
        newValue = opts.default;
    }

    if (opts.min) {
        if (newValue < opts.min) {
            newValue = opts.min;
        }

        if (newValue > opts.max) {
            newValue = opts.max;
        }
    }

    return newValue;
}

export function toPagination(value: any): Pagination {
    value = cleanJsonString(value);
    var jsonObj = JSON.parse(value);

    return {
        current: toNumber(jsonObj.pagination.current, { default: 1, min: 1 }),
        pageSize: toNumber(jsonObj.pagination.pageSize, { default: 10, min: 1, max: 1000 }),
    };
}


export function toCrudSorting(value: string): CrudSorting[] {
    value = cleanJsonString(value);
    var jsonObj = JSON.parse(value);

    var sortingActions: CrudSorting[] = [];
    for(var i = 0; i < jsonObj.sort.length; i++) {
        sortingActions.push({
            field: jsonObj.sort[i].field,
            order: jsonObj.sort[i].order
        });
    }
    return sortingActions;
}

export function toCrudFilters(value: string): CrudFilters[] {
    value = cleanJsonString(value);
    var jsonObj = JSON.parse(value);

    var filters: CrudFilters[] = [];
    for (var i = 0; i < jsonObj.filters.length; i++) {
        filters.push({
            field: jsonObj.filters[i].field,
            operator: jsonObj.filters[i].operator,
            value: jsonObj.filters[i].value,
        });
    }

    return filters;
}


function cleanJsonString(value: any) {
    // Preserve newlines, etc. - use valid JSON
    value = value.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // Remove non-printable and other non-valid JSON characters
    value = value.replace(/[\u0000-\u0019]+/g, "");
    return value;
}