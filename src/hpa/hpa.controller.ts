import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';
import { HpaService } from './hpa.service';

/**
 * Controller handeling the API endpoints for the hpa configuration collected by the hpa service
 */
@Controller('hpa')
export class HpaController {
    constructor(private readonly hpaService: HpaService) { }

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

        let allHpa = await this.hpaService.getAllHpaConfigurations();

        if (sort) {
            allHpa = sortResult(sort, allHpa);
        }
        if (filters) {
            allHpa = filterResult(filters, allHpa);
        }
        if (hasPagination) {
            allHpa = allHpa.slice(pagination.current, pagination.current + pagination.pageSize);
        }

        return allHpa;
    }

    /**
     * API endpoint to retrieve single item in a resource
     * @param id
     * @returns
     */
    @Get('/:id')
    async getOne(@Param('id') uid: string) {
        return await this.hpaService.getHpaConfigurationByUid(uid);
    }

}
