import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrometheusMetricsService } from './prometheus-metrics.service';

class QueryDto {
  metricQuery: string;
  start: string;
  end: string;
  step: string;
}

@Controller('prometheus-metrics')
export class PrometheusMetricsController {
    constructor(private readonly prometheusMetricsService: PrometheusMetricsService) { }

    /**
     * Returns value of a promehteus metric used in a hpa scaling rule within a specific time range with a specific resolution
     * @param query
     * @param start unix timestamp
     * @param end unix timestamp
     * @param step query resolution
     * @returns
     */
    @Get()
    async getPrometheusMetricsFromTo(@Query() query: any): Promise<any> {
        if(query.metricQuery && query.start && query.end && query.step) {
            return this.prometheusMetricsService.queryPrometheusTimeRange(query.metricQuery, query.start, query.end, query.step);
        }
        else if(query.metricQuery && query.start) {
            return this.prometheusMetricsService.queryPrometheusTime(query.metricQuery, query.start);
        }
        else {
            throw new BadRequestException("Please provide metricQuery, start, end and step as query parameters");
        }
    }
}
