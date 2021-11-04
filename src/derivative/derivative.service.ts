import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { ResultDto } from "./dto/result.dto";

@Injectable()
export class DerivativeService {
    constructor(private httpService: HttpService) {}

    async getMetrics(name : string, namespace : string, firstEvent : number, lastEvent : number): Promise<any> {
        let prometheusQuery ='api/v1/query_range?query=sum(rate(container_cpu_usage_seconds_total{namespace="'+ namespace +'", pod=~"'+ name +'-.*"}[1m]))&start='+ firstEvent +'&end='+ lastEvent +'&step=15s'
        const result = await this.httpService.get('http://prometheus-kube-prometheus-prometheus.default.svc.cluster.local:9090/' + prometheusQuery);
        return result;
    }

    calculateDerivative() {
        let result: ResultDto;

        result.data.result.values.
    }

}
