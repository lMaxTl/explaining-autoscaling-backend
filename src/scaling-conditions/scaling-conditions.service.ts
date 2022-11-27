import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { InjectModel } from '@nestjs/mongoose';
import { ScalingCondition, ScalingConditionDocument } from 'src/schema/scalingConditions.schema';
import { Model } from 'mongoose';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class ScalingConditionsService {
    private kubernetesConfig = new k8s.KubeConfig();

    constructor(@InjectModel(ScalingCondition.name) private conditionModel: Model<ScalingConditionDocument>) {
        this.kubernetesConfig.loadFromDefault();
        this.retrieveScalingConditions();
    }

    /**
     * Returns the hpa scaling conditions for a given deployment
     * 
     * @param name name of the deployment
     * @param namespace namespace of the deployment
     * @returns
     */
    async getScalingConditions(name: string, namespace: string): Promise<any> {
       return this.conditionModel.findOne({ deployment: name, namespace: namespace }).exec();
    }

    /**
     * Returns all scaling conditions
     * 
     * @returns
     */ 
    async getAllScalingConditions(): Promise<any> {
        return this.conditionModel.find().exec();
    }

    /**
     * Retrieves a single scaling condition by uid
     * 
     * @param uid
     * @returns
     */
    async getScalingConditionByUid(uid: string): Promise<any> {
        return this.conditionModel.findOne({uid:uid}).exec();
    }

    /**
     * Regularly retrieves the scaling conditions for all deployments
     */
    @Interval(300000)
    async retrieveScalingConditions() {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AutoscalingV2beta2Api);
        let scalingConditions = await k8sApi.listHorizontalPodAutoscalerForAllNamespaces()
            .then((res) => {
                return res.body.items;
            });
        
        scalingConditions.forEach(async (scalingCondition) => {
            this.saveScalingConditions(scalingCondition);
        });
    }


    /**
     * Saves the scaling conditions in the database
     * 
     * @param scalingCondition
     */
    private async saveScalingConditions(scalingCondition: k8s.V2beta2HorizontalPodAutoscaler) {
        const scalingConditionDocument = new this.conditionModel();

        var scalingConditionStatusConditions = scalingCondition.status.conditions;
        for (var condition of scalingConditionStatusConditions) {
            var lastSavedScalingCondition = await this.conditionModel.findOne({ uid: scalingCondition.metadata.uid }).exec();

            if (lastSavedScalingCondition) {
                //find the condition in last saved condition with the same type
                var lastSavedCondition = lastSavedScalingCondition.conditions.find((c) => c.type === condition.type);
                if (lastSavedCondition) {
                    //if the last saved condition is older than the current condition save the current condition
                    if (new Date(lastSavedCondition.lastTransitionTime) < new Date(condition.lastTransitionTime)) {
                        scalingConditionDocument.conditions.push(
                            {
                                type: condition.type,
                                status: condition.status,
                                lastTransitionTime: condition.lastTransitionTime,
                                reason: condition.reason,
                                message: condition.message
                            }
                        );
                    }

                    //otherwise dont save the current condition
                    else {
                        scalingConditionDocument.delete();
                        return;
                    }
                }

            }
            else {
                scalingConditionDocument.conditions.push(
                    {
                        type: condition.type,
                        status: condition.status,
                        lastTransitionTime: condition.lastTransitionTime,
                        reason: condition.reason,
                        message: condition.message
                    }
                );

            }
        }

        scalingConditionDocument.uid = scalingCondition.metadata.uid;
        scalingConditionDocument.deploymentName = scalingCondition.metadata.name;
        scalingConditionDocument.namespace = scalingCondition.metadata.namespace;
        scalingConditionDocument.createdAt = new Date().toISOString();
        scalingConditionDocument.save();

        
    }
}
