import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClusterMetricsService } from './clusterMetrics.service';


@Controller('cluster-metrics')
export class ClusterMetricsController {
    constructor(private readonly clusterMetricsService: ClusterMetricsService) { }

    @Get()
    getAllClusterMetrics() {
        var allClusterMetrics = this.clusterMetricsService.getAllClusterMetrics();

        return allClusterMetrics;
    }

}
