import { Injectable } from '@nestjs/common';
import { EventDto } from 'src/dto/event.dto';
@Injectable()
export class EventsService {
    receiveNewAdaptionEvent(eventDto : EventDto) {
        console.log(eventDto)
        console.log(eventDto.details.name);
        console.log(eventDto.details.namespace);
        console.log(eventDto.details.kind);
        console.log(eventDto.details.message);
      }
}
