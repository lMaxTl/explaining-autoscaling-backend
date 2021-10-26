import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SetDocument } from './schema/set.schema';
import { Event } from 'src/schema/adaptionEvent.schema';

@Injectable()
export class EventSetService {

    constructor(@InjectModel(Set.name) private setModel: Model<SetDocument>) {}

    createSetAndAddEvent(event : Event) {
        const set = new this.setModel();
        set.name = event.name;
        set.name = event.namespace;
        set.firstEvent = event.createdAt;
        set.lastEvent = event.createdAt;
        set.count = 1;
        set.reason = event.reason;
        set.scalingType = event.scalingType;
        set.events.push(event);
        console.log(set);
        set.save();
    }

    async addEventToLatestSet(event: Event) {
        const set = await this.setModel.findOne().sort({ 'createdAt': -1 }).exec();
        set.events.push(event);
        set.count = set.count + 1;
        set.lastEvent = event.createdAt;
        set.save();
    }

    getLatestSet() {
        return this.setModel.findOne().sort({ 'createdAt': -1 }).exec();
    }

    getAllSets() {
        return this.setModel.find().exec();
    }

    deleteAllSets() {
        return this.setModel.remove().exec();
    }
}
