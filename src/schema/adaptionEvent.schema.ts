import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

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
    oldReplicaSetId: MongooseSchema.Types.ObjectId;

    @Prop()
    scalingType: string;

    @Prop()
    metricType: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);