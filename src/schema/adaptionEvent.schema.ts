import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop()
    name : string;

    @Prop()
    namespace: string;

    @Prop()
    createdAt : string;

    @Prop()
    message : string;

    @Prop()
    reason : string;

    @Prop()
    replicaSize: number;

    @Prop()
    oldReplicaSize: number;

    @Prop()
    scalingType: string;

    @Prop()
    metricType: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);