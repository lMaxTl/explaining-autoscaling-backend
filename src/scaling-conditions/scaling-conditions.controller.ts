import { Body, Controller, Delete, Get, Post, Query, Param, Patch } from '@nestjs/common';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';
import { ScalingConditionsService } from './scaling-conditions.service';

@Controller('scaling-conditions')
export class ScalingConditionsController {
    constructor(private readonly scalingConditionsService: ScalingConditionsService) { }

    /**
     * API endpoint to retrieve a collection of items in a resource
     * 
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

        var allScalingConditions = await this.scalingConditionsService.getAllScalingConditions();

        
        if(sort) {
            allScalingConditions = sortResult(sort, allScalingConditions);
        }
        if(filters) {
            allScalingConditions = filterResult(filters, allScalingConditions);
        }
        if (hasPagination) {
            allScalingConditions = allScalingConditions.slice(pagination.current, pagination.current + pagination.pageSize);
        }
        
        return allScalingConditions;
    }

    /**
     * API endpoint to create single item in a resource
     * However it is not intended to create a scaling condition resource
     * 
     * @param scalingCondition
     * @returns
     */
    @Post()
    async create(@Body() scalingCondition: any) {
        throw new Error('Not implemented');
    }

    /**
     * API endpoint to delete single item in a resource
     * However it is not intended to delete a scaling condition resource
     * 
     * @param scalingCondition
     * @param id
     * @returns
     */
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        throw new Error('Not implemented');
    }

    /**
     * API endpoint to update single item in a resource
     * However it is not intended to update a scaling condition resource
     * 
     * @param scalingCondition
     * @param id
     * @returns
     */
    @Patch('/:id')
    async update(@Param('id') id: string, @Body() scalingCondition: any) {
        throw new Error('Not implemented');
    }

    /**
     * API endpoint to retrieve single item in a resource
     * 
     * @param id
     * @returns
     */
    @Get('/:id')
    async get(@Param('id') uid: string) {
        return this.scalingConditionsService.getScalingConditionByUid(uid);
    }
}
