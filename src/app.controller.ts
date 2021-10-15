import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventDto } from './dto/event.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getAdaptionEvent(@Body() eventDto : EventDto) {
    this.appService.getAdaptionEvent(eventDto);
  }
}
