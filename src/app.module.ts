import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { EventSetModule } from './event-set/event-set.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/events,'), EventsModule, EventSetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//'mongodb://mongo-mongodb.default.svc.cluster.local:27017/events,'