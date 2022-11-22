import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ClusterMetricDocument = ClusterMetric & Document;

@Schema()
export class ClusterMetric {
    @Prop()
    createdAt: string;

    @Prop()
    cpu: string;

    @Prop()
    memory: string;

    @Prop()
    podCount: string;

}

export const ClusterMetricSchema = SchemaFactory.createForClass(ClusterMetric);