import { Body,Controller, Delete, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from 'src/dto/event.dto';


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
  getLatestEvent() {
    return this.eventsService.getLatestEvent();
  }
}
