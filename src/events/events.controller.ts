import { Body,Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from 'src/dto/event.dto';
import { stringify } from 'querystring';
import { ListQueryDto } from 'src/dto/list-query.dto';
import { filterResult, sortResult } from 'src/helper/list.helper';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

  @Post()
  receiveNewAdaptionEvent(@Body() eventDto : EventDto) {
    this.eventsService.receiveNewAdaptionEvent(eventDto);
  }

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

    var allEvents = await this.eventsService.getAllEvents();
    if (hasPagination) {
        allEvents = allEvents.slice(pagination.current, pagination.current + pagination.pageSize);
    }
    if(sort) {
        allEvents = sortResult(sort, allEvents);
    }
    if(filters) {
        return filterResult(filters, allEvents);
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
   * API endpoint to update single item in a resource
   * However it is not intended to update an event in this way
   * @param event
   * @param id
   * @returns
   * @throws Error
   */
  @Patch()
  async update(@Body() event: any, @Query('id') id: string) {
      throw new Error('Not implemented');
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
