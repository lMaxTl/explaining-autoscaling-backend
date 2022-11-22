import { Controller, Get } from '@nestjs/common';
import { PrometheusMetricsService } from './prometheus-metrics.service';

@Controller('prometheus-metrics')
export class PrometheusMetricsController {
    constructor(private readonly prometheusMetricsService: PrometheusMetricsService) { }

   
    /**
     * Returns all prometheus metrics from the database
     * @returns
     */
    @Get()
    async getAllPrometheusMetrics(): Promise<any> {
        return this.prometheusMetricsService.getAllPrometheusMetrics();
    }
}
