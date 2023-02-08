import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ClusterMetricDocument = ClusterMetric & Document;

@Schema()
export class ClusterMetric {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  id: MongooseSchema.Types.ObjectId;

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
