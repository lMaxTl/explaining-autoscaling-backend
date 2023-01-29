import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hpa, HpaDocument } from 'src/schema/hpa.schema';
import * as k8s from '@kubernetes/client-node';
import { Interval } from '@nestjs/schedule';

/**
 * Service for retrieving hpa configurations from the kubernetes API and saving it in the database
 */
@Injectable()
export class HpaService {
    private kubernetesConfig = new k8s.KubeConfig();
    private savedHpaConfigurations: Array<String> = [];

    constructor(@InjectModel(Hpa.name) private hpaModel: Model<HpaDocument>) {
        this.kubernetesConfig.loadFromDefault();
        this.updateHpaConfigurations();
    }

    /**
     * Returns all hpa configurations in the cluster from the kubernetes api
     * 
     * @returns
     */
    async getAllHpaConfigurations() {
        return this.hpaModel.find().exec();
    }

    /**
     * Returns the hpa configuration for a given uid
     * 
     * @param uid
     * @returns
     */
    async getHpaConfigurationByUid(uid: string) {
        return this.hpaModel.findOne
            ({
                uid: uid
            }).exec();
    }

    /**
     * Returns the hpa configuration for a given deployment name
     * 
     * @param deploymentName
     * @returns
     */
    async getHpaConfigurationByDeploymentName(deploymentName: string, namespace: string) {
        return this.hpaModel.findOne
            ({
                deploymentName: deploymentName,
                namespace: namespace
            }).exec();
    }

    /**
     * Regularly (every 5 minutes) checks the hpa configurations in the cluster and updates the database
     * 
     * @returns
     */
    @Interval(300000)
    async updateHpaConfigurations() {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AutoscalingV2beta2Api);
        const hpaList = await k8sApi.listHorizontalPodAutoscalerForAllNamespaces();
        const hpaConfigurations = hpaList.body.items;
        this.saveHpaMetadata(hpaConfigurations);

    }


    /**
     * Saves the hpa metadata in the database
     * 
     * @param hpaConfigurations 
     * @returns
     */
    private async saveHpaMetadata(hpaConfigurations: k8s.V2beta2HorizontalPodAutoscaler[]) {
        for (let hpaConfig of hpaConfigurations) {
            for (const metric of hpaConfig.spec.metrics) {
                //TODO: Add more metric types currently only supports promehtheus external metrics
                if (metric.type === 'External') {
                    await this.saveExternalHpaMetadata(metric, hpaConfig);
                }
            }
        }
    }

    /**
     * Saves the external hpa metadata from the kubernetes api when a prometheus metric is used for scaling
     * 
     * @param metric 
     * @param hpa 
     * @param hpaConfig 
     * @returns
     */
    private async saveExternalHpaMetadata(metric: k8s.V2beta2MetricSpec, hpaConfig: k8s.V2beta2HorizontalPodAutoscaler) {

        if (await this.deploymentAllreadySaved(hpaConfig)) {
            return;
        }

        const hpa = new this.hpaModel();
        hpa.uid = hpaConfig.metadata.uid;
        hpa.namespace = hpaConfig.metadata.namespace;
        hpa.deploymentName = hpaConfig.metadata.name;
        hpa.createdAt = hpaConfig.metadata.creationTimestamp.toISOString();
        hpa.maxReplicas = hpaConfig.spec.maxReplicas;
        hpa.minReplicas = hpaConfig.spec.minReplicas;
        this.savePrometheusQueryInformation(hpaConfig, hpa);

        hpa.save();
    }

    /**
     * Extracts prometheus querys from annotation when metric name is found in key value
     * 
     * @param hpaConfig
     * @param hpa: Database model
     */ 
    private savePrometheusQueryInformation(hpaConfig: k8s.V2beta2HorizontalPodAutoscaler, hpa: Hpa & import("mongoose").Document<any, any, any> & { _id: import("mongoose").Types.ObjectId; }) {
        //TODO: Not a clean implementation -> if for some reason one metric name is a substring of another metric name it will not work
        //                                 -> if for some reason the metric name includes the substring "query" it will not work
        //                                 -> also not verified if the annotations always match with the spec metrics
        //TODO: Maybe dont descrimintate between metric scaling type?                                
        for (const [key, value] of Object.entries(hpaConfig.metadata.annotations)) {
            if (key.includes('query')) {
                for (const currentMetric of hpaConfig.spec.metrics) {
                    const currentMetricName = currentMetric.external.metric.name;
                    const scalingType = currentMetric.external.target.type;
                    if (key.includes(currentMetricName)) {
                        if (scalingType === 'AverageValue') {
                            hpa.currentMetrics.push(
                                {
                                    metricName: currentMetricName,
                                    query: value.replace(/(\r\n|\n|\r)/gm, ""),
                                    targetValue: currentMetric.external.target.averageValue,
                                    type: currentMetric.external.target.type,
                                }
                            );
                        }
                        else {
                            hpa.currentMetrics.push(
                                {
                                    metricName: currentMetricName,
                                    query: value.replace(/(\r\n|\n|\r)/gm, ""),
                                    targetValue: currentMetric.external.target.value,
                                    type: currentMetric.external.target.type,
                                }
                            );
                        }
                    }

                }
            }
        }
    }

    /**
     * Checks if the deployment targeted by the hpa condig is already saved in the database
     * 
     * @param hpaConfig
     */ 
    private async deploymentAllreadySaved(hpaConfig: k8s.V2beta2HorizontalPodAutoscaler) {
        const uid = hpaConfig.metadata.uid;
        const doesDeploymentExist = await this.hpaModel.exists({ uid: uid });
        if (doesDeploymentExist || this.savedHpaConfigurations.includes(uid)) {
            //TODO: Check if new metrics exists for this deployment
            return true;
        }
        this.savedHpaConfigurations.push(uid);
        return false;
    }
}
