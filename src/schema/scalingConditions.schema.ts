import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ScalingConditionDocument = ScalingCondition & Document;

@Schema()
export class Condition {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

    @Prop()
    type: string;
    
    @Prop()
    status: string;
    
    @Prop()
    lastTransitionTime: string;
    
    @Prop()
    reason: string;
    
    @Prop()
    message: string;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);

@Schema()
export class ScalingCondition {

    @Prop()
    deploymentName: string;

    @Prop()
    namespace: string;

    @Prop()
    uid: string;
    
    @Prop()
    createdAt: string;

    @Prop({ _id: true, type: [ConditionSchema] })
    conditions: Types.Array<Condition>;

}

export const ScalingConditionSchema = SchemaFactory.createForClass(ScalingCondition);