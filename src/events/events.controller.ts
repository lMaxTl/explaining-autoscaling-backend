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
import { EventsService } from './events.service';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';

/**
 * Controller for retrieving and displaying events
 */
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * API endpoint to recieve new events from the kubernetes event exporter
   */
  @Post()
  receiveNewAdaptionEvent(@Body() eventDto: any) {
    this.eventsService.receiveNewAdaptionEvent(eventDto);
  }

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

    let allEvents = await this.eventsService.getAllEvents();

    if (sort) {
      allEvents = sortResult(sort, allEvents);
    }
    if (filters) {
      allEvents = filterResult(filters, allEvents);
    }
    if (hasPagination) {
      allEvents = allEvents.slice(
        pagination.current,
        pagination.current + pagination.pageSize,
      );
    }
    return allEvents;
  }

  /**
   * API endpoint to delete single item in a resource
   *
   * @param event
   * @param id
   * @returns
   */
  @Delete('/:id')
  async deleteOne(@Body() event: any, @Param('id') id: string) {
    this.eventsService.deleteEventById(id);
  }

  /**
   * API endpoint to delete all items in a resource
   */
  @Delete()
  async deleteAll() {
    this.eventsService.deleteAllEvents();
  }

  /**
   * API endpoint to retrieve single item in a resource
   *
   * @param id
   * @returns
   */
  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
