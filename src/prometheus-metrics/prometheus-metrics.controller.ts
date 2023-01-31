import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrometheusMetricsService } from './prometheus-metrics.service';

class QueryDto {
  metricQuery: string;
  start: string;
  end: string;
  step: string;
}

/**
 * Controller handeling the API endpoint to query prometheus metrics
 */
@Controller('prometheus-metrics')
export class PrometheusMetricsController {
    constructor(private readonly prometheusMetricsService: PrometheusMetricsService) { }

    /**
     * Returns value of a promehteus metric used in a hpa scaling rule within a specific time range 
     * @param query
     * @param start unix timestamp
     * @param end unix timestamp
     * @returns
     */
    @Get()
    async getPrometheusMetricsFromTo(@Query() query: any): Promise<any> {
        if(query.metricQuery && query.start && query.end) {
            return this.prometheusMetricsService.getHpaMetricQueryValues(query.metricQuery, query.start, query.end);
        }
        else if(query.metricQuery && query.start) {
            return this.prometheusMetricsService.queryPrometheusTime(query.metricQuery, query.start);
        }
        else {
            throw new BadRequestException("Please provide metricQuery, start and end as query parameters");
        }
    }

}
