import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongo-mongodb.default.svc.cluster.local:27017/events,'), EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
