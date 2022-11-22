import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { PodMetricsService } from './pod-metrics.service';

@Controller('pod-metrics')
export class PodMetricsController {
    constructor(private readonly podMetricsService: PodMetricsService) { }

    @Get('/:namespace/:podName')
    getPodContainerInformation(@Param('namespace') namespace: string, @Param('podName') podName: string) {
        var podMetrics = this.podMetricsService.getPodContainerInformation(namespace, podName);
        return podMetrics;
    }
}
