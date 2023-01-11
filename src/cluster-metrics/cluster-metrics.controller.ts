import { Body, Controller, Delete, Get, Post, Query, Param, Patch } from '@nestjs/common';
import { ClusterMetricsService } from './cluster-metrics.service';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';

@Controller('cluster-metrics')
export class ClusterMetricsController {
    constructor(private readonly clusterMetricsService: ClusterMetricsService) { }


    /**
     * API endpoint to retrieve a collection of items in a resource
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
     * API endpoint to create single item in a resource
     * However it is not intended to create a cluster metric resource
     * @param clusterMetric 
     */
    @Post()
    async create(@Body() clusterMetric: any) {
        throw new Error('Not implemented');
    }

    /**
     * API endpoint to delete single item in a resource
     * However it is not intended to delete a cluster metric resource
     * @param clusterMetric
     * @param id
     * @returns
     * @throws Error
     */
    @Delete('/:id')
    async deleteOne(@Body() clusterMetric: any, @Param('id') id: string) {
        throw new Error('Not implemented');
    }

    /**
     * API endpoint to update single item in a resource
     * However it is not intended to update a cluster metric resource
     * @param clusterMetric
     * @param id
     * @returns
     */
    @Patch('/:id')
    async update(@Body() clusterMetric: any, @Param('id') id: string) {
        throw new Error('Not implemented');
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



