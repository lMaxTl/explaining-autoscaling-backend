import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { PodMetricsService } from './pod-metrics.service';

@Controller('pod-metrics')
export class PodMetricsController {
    constructor(private readonly podMetricsService: PodMetricsService) { }

    @Get('/:namespace/:deploymentName')
    async getPodContainerInformation(@Param('namespace') namespace: string, @Param('deploymentName') deployment: string) {
        var podList = await this.podMetricsService.getPodsInDeployment(deployment, namespace);
        var podMetrics = [];
        for (const pod of podList) {
            let podInformation = await this.podMetricsService.getPodContainerInformation(pod);
            podMetrics.push(podInformation);
        }
        
        return podMetrics;
    }
}
