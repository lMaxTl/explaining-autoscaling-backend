import { Body, Controller, Delete, Get, Post, Query, Param, Patch } from '@nestjs/common';
import { ClusterMetricsService } from './cluster-metrics.service';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';

/**
 * Controller handeling the API endpoints for the cluster metrics collected by the cluster metrics service
 * 
 * Currently collected metrics:
 * - CPU usage (sum(irate(container_cpu_usage_seconds_total[1m])))
 * - Memory usage (sum(container_memory_usage_bytes))
 * - Pod count (count(kube_pod_info))
 * 
 */
@Controller('cluster-metrics')
export class ClusterMetricsController {
    constructor(private readonly clusterMetricsService: ClusterMetricsService) { }


    /**
     * API endpoint to retrieve a collection of items in a resource
     * 
     * 
     * @param hasPagination
     * @param pagination
     * @param sort
     * @param filters
     * @returns
     */
    @Get()
    async getList(@Query() query: ListQueryDto) {
        let hasPagination = query.hasPagination;
        let pagination = query.pagination;
        let sort = query.sort;
        let filters = query.filters;


        let allClusterMetrics = await this.clusterMetricsService.getAllClusterMetrics();



        if (sort) {
            allClusterMetrics = sortResult(sort, allClusterMetrics);
        }
        if (filters) {
            allClusterMetrics = filterResult(filters, allClusterMetrics);
        }
        if (hasPagination) {
            allClusterMetrics = allClusterMetrics.slice(pagination.current, pagination.current + pagination.pageSize);
        }

        return allClusterMetrics;
    }

    /**
     * API endpoint to get single item in a resource
     * 
     * @param id
     * @returns
     */
    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return this.clusterMetricsService.getClusterMetricById(id);
    }


}



