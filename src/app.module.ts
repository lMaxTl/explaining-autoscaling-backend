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
import { DerivativeService } from './derivative/derivative.service';
import { HttpModule } from '@nestjs/axios';
import { DerivativeController } from './derivative/derivative.controller';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/events,'), MongooseModule.forFeature([{name: Event.name, schema: EventSchema},
  {name: Set.name, schema: SetSchema}]), HttpModule],
  controllers: [AppController, EventsController, EventSetController, DerivativeController],
  providers: [AppService, EventsService, EventSetService, DerivativeService],
})
export class AppModule {}
//'mongodb://mongo-mongodb.default.svc.cluster.local:27017/events,'