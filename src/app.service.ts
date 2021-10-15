import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAdaptionEvent(eventDto : EventDto) {
    console.log(eventDto)
  }
}
