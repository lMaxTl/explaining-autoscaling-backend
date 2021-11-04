import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DerivativeService } from 'src/derivative/derivative.service';
import { EventDto } from 'src/dto/event.dto';
import { EventSetService } from 'src/event-set/event-set.service';
import { Event, EventDocument } from 'src/schema/adaptionEvent.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>, private eventSetService: EventSetService, private derivativeService: DerivativeService) { }

    async receiveNewAdaptionEvent(eventDto: EventDto) {
        let isRelated: boolean;
        const event = new this.eventModel();
        if (eventDto.details.reason === 'SuccessfulRescale') {
            event.createdAt = eventDto.createdAt;
            event.name = eventDto.details.name;
            event.namespace = eventDto.details.namespace;
            event.reason = eventDto.details.reason;
            event.message = eventDto.details.message;
            event.scalingType = this.extractScalingType(event);
            event.replicaSize = this.extractReplicaSize(event);
            event.metricType = this.extractMetricType(event);
            await this.isRelated(event).then(function(v) {isRelated = v})
            if (isRelated) {
                console.log('isRelated')
                this.eventSetService.addEventToLatestSet(event);
            } else {
                console.log('isNotRelated')
                this.eventSetService.createSetAndAddEvent(event);
            }
            event.save();
        }
        
        

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

    /* async create(eventDto: EventDto): Promise<Event> {
        const createEvent = new this.eventModel();
        createEvent.createdAt = eventDto.createdAt;
        createEvent.name = eventDto.details.name;
        createEvent.namespace = eventDto.details.namespace;
        createEvent.reason = eventDto.details.reason;
        createEvent.message = eventDto.details.message;
        return createEvent.save();
    } */

    async getLatestEvent(name : string, namespace : string): Promise<Event> {
        return this.eventModel.findOne({'name' : name, 'namespace' : namespace}).sort({ 'createdAt': -1}).exec();
    }

    async getAllEvents(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }

    async deleteAllEvents() {
        return this.eventModel.remove().exec();
    }

    extractScalingType(event: Event): string {
        let regexScaleUp = /(above)/g;
        let regexScaleDown = /(below)/g;
        let scalingType = '';
        if (regexScaleUp.test(event.message)) {
            scalingType = 'scaleUp'
        } else if (regexScaleDown.test(event.message)) {
            scalingType = 'scaleDown'
        } else {
            scalingType = 'TBD'
        }
        return scalingType;
    }

    extractReplicaSize(event : Event): number {
        let regexReplicaSize = /New size\: (\d+)/;
        let replicaSize =NaN;
        try {
            replicaSize = parseInt(event.message.match(regexReplicaSize).pop());
        } catch (error) {
            
        }
        return replicaSize;
    }

    extractMetricType(event: Event): string {
        let regexMetricType = /test/;
        let metricType = '';
        try {
            metricType = event.message.match(regexMetricType).pop()
        } catch (error) {
            
        }
        return metricType;

    }

    async isRelated(event: Event): Promise<boolean> {
        let latestEvent: Event;
        await this.getLatestEvent(event.name, event.namespace).then(function (v) { latestEvent = v });
        console.log(latestEvent)
        if (this.isRelatedByTime(event, latestEvent) && this.isRelatedByScalingType(event, latestEvent) && this.isRelatedByDerivative(event, latestEvent)) {
            return true;
        } else {
            return false;
        }
    }
    
    isRelatedByTime(event: Event, latestEvent: Event): boolean {
        if (latestEvent === null) {
            return false;
        }
        const currentDate = new Date(event.createdAt);
        const latestDate = new Date(latestEvent.createdAt)
        let difference = Math.abs(currentDate.getTime() - latestDate.getTime());
        console.log(difference);
        return true;    
    }

    isRelatedByDerivative(event: Event, latestEvent: Event): boolean {
        let eventTime = new Date(event.createdAt).getTime();
        let latestEventTime = new Date(latestEvent.createdAt).getTime(); 
        this.derivativeService.calculateDerivative(event.name, event.namespace, latestEventTime, eventTime, event.metricType)
        console.log('derivative')
        return true;
    }

    isRelatedByScalingType(event: Event, latestEvent: Event): boolean {
        if (event.scalingType === latestEvent.scalingType && event.scalingType != 'TBD' ) {
            console.log(event.scalingType + '=' + latestEvent.scalingType)
            console.log('scalingType matches')
            return true;
        } else {
            return false;
        }
    }
}
