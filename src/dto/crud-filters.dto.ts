export class CrudFilters {
    field: string;
    operator: "eq" |
        "ne" |
        "lt" |
        "gt" |
        "lte" |
        "gte" |
        "in" |
        "nin" |
        "contains" |
        "ncontains" |
        "containss" |
        "ncontainss" |
        "between" |
        "nbetween" |
        "null" |
        "nnull" |
        "startswith" |
        "nstartswith" |
        "startswiths" |
        "nstartswiths" |
        "endswith" |
        "nendswith" |
        "endswiths" |
        "nendswiths";
    value: any;
}