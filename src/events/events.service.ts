import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from 'src/dto/event.dto';
import { Event, EventDocument } from 'src/schema/adaptionEvent.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}
    receiveNewAdaptionEvent(eventDto : EventDto) {
        console.log(eventDto);
        console.log(eventDto.details.name);
        console.log(eventDto.details.namespace);
        console.log(eventDto.details.kind);
        console.log(eventDto.details.message);
        this.create(eventDto);
      }

    async create(eventDto: EventDto): Promise<Event> {
        const createEvent = new this.eventModel();
        createEvent.createdAt = eventDto.createdAt;
        createEvent.name = eventDto.details.name;
        createEvent.namespace = eventDto.details.namespace;
        createEvent.reason = eventDto.details.reason;
        createEvent.message = eventDto.details.message;
        return createEvent.save();
    }

    async getAllEvents(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }
    
    async deleteAllEvents() {
        return this.eventModel.remove().exec();
    }
}
