import { Module } from '@nestjs/common';
import { EventSetService } from './event-set.service';
import { EventSetController } from './event-set.controller';

@Module({
  providers: [EventSetService],
  controllers: [EventSetController]
})
export class EventSetModule {}
