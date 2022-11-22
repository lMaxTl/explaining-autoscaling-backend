import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PrometheusMetricDocument = PrometheusMetric & Document;

@Schema()
export class PrometheusMetric {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

    @Prop({ type: String })
    queriedAt: string;

    @Prop({ type: String })
    metricName: string;

    @Prop({ type: String })
    query: string;

    @Prop({ type: String })
    value: string;

}

export const PrometheusMetricSchema = SchemaFactory.createForClass(PrometheusMetric);