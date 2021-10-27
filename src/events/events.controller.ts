import { Body,Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from 'src/dto/event.dto';
import { stringify } from 'querystring';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

  @Post()
  receiveNewAdaptionEvent(@Body() eventDto : EventDto) {
    this.eventsService.receiveNewAdaptionEvent(eventDto);
  }
  @Get()
  getAllEvents() {
      return this.eventsService.getAllEvents();
  }

  @Delete()
  deleteAllEvents() {
    return this.eventsService.deleteAllEvents();
  }
  @Get('latest')
  getLatestEvent(@Query('name')name :string,
  @Query('namespace') namespace: string) {
    return this.eventsService.getLatestEvent(name, namespace);
  }
}
