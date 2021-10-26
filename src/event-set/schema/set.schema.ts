import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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
    count : string;

    @Prop()
    reason : string;

    @Prop()
    scalingType: string;

}

export const SetSchema = SchemaFactory.createForClass(Set);