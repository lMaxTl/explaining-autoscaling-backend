import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';
import { HpaService } from './hpa.service';

/**
 * Controller handeling the API endpoints for the hpa configuration collected by the hpa service
 */
@Controller('hpa')
export class HpaController {
  constructor(private readonly hpaService: HpaService) {}

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
    const hasPagination = query.hasPagination;
    const pagination = query.pagination;
    const sort = query.sort;
    const filters = query.filters;

    let allHpa = await this.hpaService.getAllHpaConfigurations();

    if (sort) {
      allHpa = sortResult(sort, allHpa);
    }
    if (filters) {
      allHpa = filterResult(filters, allHpa);
    }
    if (hasPagination) {
      allHpa = allHpa.slice(
        pagination.current,
        pagination.current + pagination.pageSize,
      );
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

  /**
   * API endpoint to retrieve hpa configuration for a given deployment name and namespace
   * @param deploymentName
   * @param namespace
   * @returns
   */
  @Get('/:namespace/:deploymentName')
  async getOneByDeploymentName(
    @Param('namespace') namespace: string,
    @Param('deploymentName') deploymentName: string,
  ) {
    return await this.hpaService.getHpaConfigurationByDeploymentName(
      deploymentName,
      namespace,
    );
  }
}
