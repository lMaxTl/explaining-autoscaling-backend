import { Controller, Get, Param } from '@nestjs/common';
import { PodMetricsService } from './pod-metrics.service';

/**
 * Controller handeling the API endpoints for the pod container metrics collected by the pod metrics service.
 */
@Controller('pod-metrics')
export class PodMetricsController {
    constructor(private readonly podMetricsService: PodMetricsService) { }

    /**
    * Returns information about the container of all pods in a namespace and deployment at a given timestamp
    * 
    * @param namespace
    * @param deployment
    * @param timestamp
    */
    @Get('/:namespace/:deploymentName/:timestamp')
    async getPodContainerInformation(@Param('namespace') namespace: string, @Param('deploymentName') deployment: string, @Param('timestamp') timestamp: string) {
        let podList = await this.podMetricsService.getPodsInDeployment(deployment, namespace);
        let podMetrics = [];
        for (const pod of podList) {
            let podInformation = await this.podMetricsService.getSavedPodInformation(pod.metadata.name, namespace, new Date(timestamp));
            podMetrics.push(podInformation.containerInformation);
        }

        return podMetrics;
    }
}
