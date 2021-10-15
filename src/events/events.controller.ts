import { Body,Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from 'src/dto/event.dto';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
    @Post()
  receiveNewAdaptionEvent(@Body() eventDto : EventDto) {
    this.eventsService.receiveNewAdaptionEvent(eventDto);
  }
}
