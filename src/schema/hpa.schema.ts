import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HpaDocument = Hpa & Document;

@Schema()
export class Metric extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

    @Prop({ type: String })
    metricName: string;

    @Prop({ type: String })
    query: string;

    @Prop({ type: String })
    targetValue: string;

    @Prop({ type: String })
    type: string;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);

@Schema()
export class Hpa {
    @Prop()
    uid: string;

    @Prop()
    namespace: string;

    @Prop()
    deploymentName: string;

    @Prop()
    createdAt: string;

    @Prop()
    maxReplicas: number;

    @Prop()
    minReplicas: number;

    @Prop({ _id: true, type: [MetricSchema] })
    currentMetrics: Types.Array<Metric>;

}
export const HpaSchema = SchemaFactory.createForClass(Hpa);