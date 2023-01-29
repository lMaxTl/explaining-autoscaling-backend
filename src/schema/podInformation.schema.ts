import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { V1ContainerState } from "@kubernetes/client-node";

export type PodInformationDocument = PodInformation & Document;


@Schema()
export class ContainerInformation extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

    @Prop({ type: String })
    containerID: string;

    @Prop({ type: String })
    image: string;

    @Prop({ type: V1ContainerState })
    lastState: V1ContainerState;

    @Prop({ type: String })
    name: string;

    @Prop({ type: Boolean })
    ready: boolean;

    @Prop({ type: Number })
    restartCount: number;

    @Prop({ type: Boolean })
    started: boolean;

    @Prop({ type: V1ContainerState })
    status: V1ContainerState;

}
export const ContainerInformationSchema = SchemaFactory.createForClass(ContainerInformation);




@Schema()
export class PodInformation {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    _id: MongooseSchema.Types.ObjectId

    @Prop()
    namespace: string;

    @Prop()
    podName: string;

    @Prop()
    createdAt: string;

    @Prop({ _id: true, type: [ContainerInformationSchema] })
    containerInformation: Types.Array<ContainerInformation>;
}

export const PodInformationSchema = SchemaFactory.createForClass(PodInformation);