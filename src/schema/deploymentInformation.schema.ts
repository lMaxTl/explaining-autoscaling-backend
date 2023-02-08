import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { V1DeploymentCondition } from '@kubernetes/client-node';

export type DeploymentInformationDocument = DeploymentInformation & Document;

@Schema()
export class DeploymentInformation {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  deploymentName: string;

  @Prop({ type: String })
  namespace: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: Number })
  replicas: number;

  @Prop({ type: Number })
  availableReplicas: number;

  @Prop({ type: Number })
  unavailableReplicas: number;

  @Prop({ type: Array })
  conditions: Array<V1DeploymentCondition>;
}

export const DeploymentInformationSchema = SchemaFactory.createForClass(
  DeploymentInformation,
);
