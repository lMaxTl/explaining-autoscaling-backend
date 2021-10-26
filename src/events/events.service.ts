import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from 'src/dto/event.dto';
import { Event, EventDocument } from 'src/schema/adaptionEvent.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    receiveNewAdaptionEvent(eventDto : EventDto) {
        const event = new this.eventModel();
        event.createdAt = eventDto.createdAt;
        event.name = eventDto.details.name;
        event.namespace = eventDto.details.namespace;
        event.reason = eventDto.details.reason;
        event.message = eventDto.details.message;
        event.scalingType = this.extractScalingType(event);
        if(this.isRelated(event)) {

        } else {

        }
        console.log(eventDto);
        console.log(eventDto.details.name);
        console.log(eventDto.details.namespace);
        console.log(eventDto.details.kind);
        console.log(eventDto.details.message);
        event.save();
        
      }

    /* convertEventDtoToDbSchema(eventDto: EventDto): Event {
        const event = new this.eventModel();
        event.createdAt = eventDto.createdAt;
        event.name = eventDto.details.name;
        event.namespace = eventDto.details.namespace;
        event.reason = eventDto.details.reason;
        event.message = eventDto.details.message;
        return event;
    } */
    
    async create(eventDto: EventDto): Promise<Event> {
        const createEvent = new this.eventModel();
        createEvent.createdAt = eventDto.createdAt;
        createEvent.name = eventDto.details.name;
        createEvent.namespace = eventDto.details.namespace;
        createEvent.reason = eventDto.details.reason;
        createEvent.message = eventDto.details.message;
        return createEvent.save();
    }
    
    async getLatestEvent(): Promise<Event> {
        return this.eventModel.findOne().sort({'createdAt' : -1}).exec();
    }

    async getAllEvents(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }
    
    async deleteAllEvents() {
        return this.eventModel.remove().exec();
    }

    extractScalingType(event : Event) : string {
        let regexScaleUp = /(metrics below target)/g;
        let regexScaleDown = /(above target)/g;
        let scalingType = '';
        if(event.message.search(regexScaleUp)) {
            scalingType = 'scaleUp'
        } else if(event.message.search(regexScaleDown)) {
            scalingType = 'scaleDown'
        } else {
            scalingType = 'TBD'
        }
        return scalingType;
    }

    isRelated(event : Event): boolean {
        let latestEvent = this.getLatestEvent();

        if (this.isRelatedByTime() && this.isRelatedByScalingType && this.isRelatedByTime) {
            return true;
        } else {
            return false;
        }
    }

    isRelatedByTime(): boolean {
        return null;
    }

    isRelatedByDerivative(): boolean {
        return null;
    }

    isRelatedByScalingType(): boolean {
        return null;
    }
}
