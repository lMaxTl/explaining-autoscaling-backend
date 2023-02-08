import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';
import { ScalingConditionsService } from './scaling-conditions.service';

/**
 * Controller handeling the API endpoints for the scaling conditions collected by the scaling conditions service.
 */
@Controller('scaling-conditions')
export class ScalingConditionsController {
  constructor(
    private readonly scalingConditionsService: ScalingConditionsService,
  ) {}

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
    const hasPagination = query.hasPagination;
    const pagination = query.pagination;
    const sort = query.sort;
    const filters = query.filters;

    let allScalingConditions =
      await this.scalingConditionsService.getAllScalingConditions();

    if (sort) {
      allScalingConditions = sortResult(sort, allScalingConditions);
    }
    if (filters) {
      allScalingConditions = filterResult(filters, allScalingConditions);
    }
    if (hasPagination) {
      allScalingConditions = allScalingConditions.slice(
        pagination.current,
        pagination.current + pagination.pageSize,
      );
    }

    return allScalingConditions;
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
