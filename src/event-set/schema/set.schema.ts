import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Event } from 'src/schema/adaptionEvent.schema';

export type SetDocument = Set & Document;

@Schema()
export class Set {
    @Prop()
    name : string;

    @Prop()
    namespace: string;

    @Prop()
    firstEvent : string;

    @Prop()
    lastEvent : string;

    @Prop()
    count : number;

    @Prop()
    reason : string;

    @Prop()
    scalingType: string;

    @Prop()
    events: Event[];

}

export const SetSchema = SchemaFactory.createForClass(Set);