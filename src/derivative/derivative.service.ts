import { ConsoleLogger, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { ResultDto } from "./dto/result.dto";
import { first, firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { EventDto } from 'src/dto/event.dto';
import { response } from 'express';

@Injectable()
export class DerivativeService {
    constructor(private httpService: HttpService) {}

    private getMetrics(name : string, namespace : string, firstEvent : number, lastEvent : number, metricType : string): Observable<any>{
        let result: ResultDto;
        let prometheusQuery ='api/v1/query_range?query=sum(rate(container_cpu_usage_seconds_total{namespace="'+ namespace +'", pod=~"'+ name +'-.*"}[1m]))&start='+ firstEvent +'&end='+ lastEvent +'&step=15s'
        return this.httpService.get('http://localhost:9090/api/v1/query_range?query=sum(rate(container_cpu_usage_seconds_total{namespace="default", pod=~"uibackend-.*"}[1m]))&start=1635941829&end=1635942429&step=15s')
        
    }
//prometheus-kube-prometheus-prometheus.default.svc.cluster.local
    async calculateDerivative(name : string, namespace : string, firstEvent : number, lastEvent : number, metricType: string) {
        let result;
        let negativeGradient = 0;
        let positiveGradient = 0;
        let positivePercentage;
        result = await lastValueFrom(this.getMetrics(name, namespace, firstEvent, lastEvent, metricType)) 
        let metrics: Array<any> = result.data.data.result.pop().values;
        for (let i = 0; i < metrics.length - 1; i++) {
            if ((parseFloat(metrics[i][1]) - parseFloat(metrics[i + 1][1])) < 0) {
                negativeGradient = negativeGradient + 1;
            } else {
                positiveGradient = positiveGradient + 1;
            }
        }
        positivePercentage = positiveGradient / metrics.length
        return positivePercentage;
    }
//'http://localhost:9090/' + prometheusQuery
}
