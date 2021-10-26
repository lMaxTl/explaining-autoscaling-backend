import { Module } from '@nestjs/common';
import { EventSetService } from './event-set.service';

@Module({
  providers: [EventSetService]
})
export class EventSetModule {}
