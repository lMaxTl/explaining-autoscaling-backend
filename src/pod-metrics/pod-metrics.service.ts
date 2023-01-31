import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as k8s from '@kubernetes/client-node';
import { PodInformation, PodInformationDocument } from 'src/schema/podInformation.schema';
import { Model, Types } from 'mongoose';
import { Interval } from '@nestjs/schedule';

/**
 * Service for retrieving pod information from the kubernetes API and saving it in the database
 */
@Injectable()
export class PodMetricsService {
    private kubernetesConfig = new k8s.KubeConfig();

    constructor(@InjectModel(PodInformation.name) private podInformationModel: Model<PodInformationDocument>) {
        this.kubernetesConfig.loadFromDefault();
        this.savePodInformation();
    }

    /**
     * Saves regularly (every 5 min) the pod information in the namspace default in the database.
     */
    @Interval(300000)
    async savePodInformation() {
        const deploymentsUnfiltered = await this.getDeployments('default');
        const deployments = this.filterDeployments(deploymentsUnfiltered);

        const podList = [];
        for (const deployment of deployments) {
            const pods = await this.getPodsInDeployment(deployment.metadata.name, 'default');
            for (const pod of pods) {
                podList.push(pod);
            }
        }

        for (const pod of podList) {
            const containerInformation = await this.getPodContainerInformation(pod);
            const podInformation = new this.podInformationModel({
                _id: new Types.ObjectId(),
                podName: pod.metadata.name,
                namespace: pod.metadata.namespace,
                createdAt: new Date().toISOString(),
                containerInformation: containerInformation
            });
            await podInformation.save();
        }
    }

    /**
     * Removes blacklisted deployments from the list of deployments.
     * 
     * The blacklist includes the following deployments:
     * - the backend and frontend of the application, mongodb, prometheus and grafana
     * 
     * @param deploymentsUnfiltered deployments
     * @returns 
     */
    private filterDeployments(deploymentsUnfiltered: k8s.V1Deployment[]) {
        const deploymentBlacklist = ["ba", "ba-frontend", "blackbox-exporter-prometheus-blackbox-exporter", "mongo-mongodb", "prometheus-grafana", "prometheus-kube-prometheus-operator", "prometheus-kube-state-metrics"]
        const deployments = [];

        for (const deployment of deploymentsUnfiltered) {
            if (!deploymentBlacklist.includes(deployment.metadata.name)) {
                deployments.push(deployment);
            }
        }
        return deployments;
    }

    /**
     * Retrieves the saved information about a pod from the database closest to a specific time.
     * 
     * @param podName
     * @param namespace
     */
    async getSavedPodInformation(podName: string, namespace: string, timestamp: Date) {
        // add 4 minutes to the timestamp to get the closest information
        const timeBias = 240000;
        timestamp.setMilliseconds(timestamp.getMilliseconds() + timeBias);
        const podInformation = await this.podInformationModel.find({ podName: podName, namespace: namespace, createdAt: { $lte: timestamp } }).sort({ createdAt: -1 }).limit(1);
        return podInformation[0];
    }

    /**
     * Retrieves information about the container of a pod from the kubernetes API.
     * 
     * @param podName 
     * @param namespace 
     * @returns 
     */
    async getPodContainerInformation(pod: any) {
        const containerStatuses = pod.status.containerStatuses;
        const containerInformation = [];

        try {
            for (const containerStatus of containerStatuses) {
                const containerInfo = {
                    containerID: containerStatus.containerID,
                    image: containerStatus.image,
                    lastState: containerStatus.lastState,
                    name: containerStatus.name,
                    ready: containerStatus.ready,
                    restartCount: containerStatus.restartCount,
                    started: containerStatus.started,
                    status: containerStatus.state,
                }
                containerInformation.push(containerInfo);
            }
            return containerInformation;
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Retrieves all deployments of a namespace from the kubernetes API.
     * 
     * @param namespace
     * @returns
     * 
     */
    async getDeployments(namespace: string) {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AppsV1Api);
        const deploymentList = await k8sApi.listNamespacedDeployment(namespace);
        return deploymentList.body.items;
    }

    /**
     * Retrieves the all pods of a replica set from the kubernetes API.
     * 
     * @param deploymentName
     * @param namespace
     * @returns
     */
    async getPodsInDeployment(deploymentName: string, namespace: string) {
        const replicaSetName = await this.getReplicaSetOfDeployment(deploymentName, namespace);
        const pods = await this.getPodsFromReplicaSet(namespace, replicaSetName);
        return pods;
    }

    /**
     * Retrieves the pods of a replica set from the kubernetes API.
     * 
     * @param namespace 
     * @param replicaSetNames 
     * @returns 
     */
    private async getPodsFromReplicaSet(namespace: string, replicaSetNames: string[]) {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.CoreV1Api);
        const podList = await k8sApi.listNamespacedPod(namespace);
        const podsInDeployment = [];

        for (const pod of podList.body.items) {
            if (replicaSetNames.includes(pod.metadata.ownerReferences[0].name)) {
                podsInDeployment.push(pod);
            }
        }
        return podsInDeployment;
    }

    /**
     * Retrieves the replica set of a deployment from the kubernetes API.
     * 
     * @param deploymentName
     * @param namespace
     * @returns
     */
    async getReplicaSetOfDeployment(deploymentName: string, namespace: string) {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AppsV1Api);
        const deployment = await k8sApi.readNamespacedDeployment(deploymentName, namespace);
        const labels = deployment.body.metadata.labels;
        const labelSelector = Object.keys(labels)
            .map(key => `${key}=${labels[key]}`)
            .join(',');
        const replicaSetList = await k8sApi.listNamespacedReplicaSet(namespace, undefined, undefined, undefined, undefined, labelSelector);
        const replicaSets = replicaSetList.body.items;
        const collectedReplicaSetNames = [];
        for (const replicaSet of replicaSets) {
            collectedReplicaSetNames.push(replicaSet.metadata.name);
        }


        return collectedReplicaSetNames;
    }



}
