import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';
import { HpaService } from './hpa.service';


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
        var hasPagination = query.hasPagination;
        var pagination = query.pagination;
        var sort = query.sort;
        var filters = query.filters;
        
        var allHpa = await this.hpaService.getAllHpaConfigurations();
        if (hasPagination) {
            allHpa = allHpa.slice(pagination.current, pagination.current + pagination.pageSize);
        }
        if(sort) {
            allHpa = sortResult(sort, allHpa);
        }
        if(filters) {
            return filterResult(filters, allHpa);
        }

        return allHpa;
    }

    /**
     * API endpoint to delete single item in a resource
     * However it is not intended to delete a hpa resource
     *
     * @param event
     * @param id
     * @returns
     */
    @Delete('/:id')
    async deleteOne(@Body() event: any, @Param('id') id: string) {
        throw new Error("Method not implemented.");
    }

    /**
     * API endpoint to create single item in a resource
     * However it is not intended to create a hpa resource
     * @param hpa
     * @returns
     */
    @Post()
    async create(@Body() hpa: any) {
        throw new Error("Method not implemented.");
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

    /**
     * API endpoint to update single item in a resource
     * However it is not intended to update a hpa resource
     * @param hpa
     * @param id
     * @returns
     */
    @Patch('/:id')
    async update(@Body() hpa: any, @Param('id') id: string) {
        throw new Error("Method not implemented.");
    }
    
}
