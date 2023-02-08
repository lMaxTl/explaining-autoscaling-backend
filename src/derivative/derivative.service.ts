import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ResultDto } from './dto/result.dto';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class DerivativeService {
  constructor(private httpService: HttpService) {}

  private getMetrics(
    name: string,
    namespace: string,
    latestEvent: number,
    currentEvent: number,
    metricType: string,
  ): Observable<any> {
    let result: ResultDto;
    const prometheusQuery =
      '/api/v1/query_range?query=sum(rate(container_cpu_usage_seconds_total{namespace="' +
      namespace +
      '", pod=~"' +
      name +
      '-.*"}[1m]))&start=' +
      latestEvent +
      '&end=' +
      currentEvent +
      '&step=15s';
    console.log(prometheusQuery);
    try {
      return this.httpService.get('http://localhost:9090' + prometheusQuery);
    } catch (error) {
      console.log(error);
    }

    //prometheus-kube-prometheus-prometheus.default.svc.cluster.local
  }
  async calculateDerivative(
    name: string,
    namespace: string,
    lastEvent: number,
    firstEvent: number,
    metricType: string,
  ) {
    let result;
    let negativeGradient = 0;
    let positiveGradient = 0;
    let positivePercentage;
    result = await lastValueFrom(
      this.getMetrics(name, namespace, lastEvent, firstEvent, metricType),
    );
    if (
      Array.isArray(result.data.data.result) &&
      result.data.data.result.length
    ) {
      const metrics: Array<any> = result.data.data.result.pop().values;
      for (let i = 0; i < metrics.length - 1; i++) {
        if (parseFloat(metrics[i][1]) - parseFloat(metrics[i + 1][1]) < 0) {
          negativeGradient = negativeGradient + 1;
        } else {
          positiveGradient = positiveGradient + 1;
        }
      }
      positivePercentage = positiveGradient / metrics.length;
      return positivePercentage;
    }

    return (positivePercentage = -1);
  }

  hasPromQl(metricType: string): boolean {
    if (true) {
      return true;
    } else {
      return false;
    }
  }

  getPromQl(metricType: string): string {
    let promQl: string;

    return promQl;
  }
}
