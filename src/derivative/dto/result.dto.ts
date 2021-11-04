/* export class ResultDto {
    status: string;
    data: {
        resultType: string;
        result: [
            {
                metric: {};
                values: [];
            }
        ]

    }
} */
export interface ResultDto {
    status: string;
    data:   Data;
}

export interface Data {
    resultType: string;
    result:     Result[];
}

export interface Result {
    metric: Metric;
    values: Array<Value[]>;
}

export interface Metric {
}

export type Value = number | string;
