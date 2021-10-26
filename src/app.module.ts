import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { EventSetService } from './event-set/event-set.service';
import { EventSetController } from './event-set/event-set.controller';
import { Event, EventSchema } from './schema/adaptionEvent.schema';
import { Set, SetSchema } from './event-set/schema/set.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/events,'), MongooseModule.forFeature([{name: Event.name, schema: EventSchema},
  {name: Set.name, schema: SetSchema}])],
  controllers: [AppController, EventsController, EventSetController],
  providers: [AppService, EventsService, EventSetService],
})
export class AppModule {}
//'mongodb://mongo-mongodb.default.svc.cluster.local:27017/events,'