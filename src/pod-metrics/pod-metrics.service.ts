import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class PodMetricsService {
    private kubernetesConfig = new k8s.KubeConfig();

    constructor() {
        this.kubernetesConfig.loadFromDefault();
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

    }

    /**
     * Retrieves the all pods of a replica set from the kubernetes API.
     * 
     * @param deploymentName
     * @param namespace
     * @returns
     */
    async getPodsInDeployment(deploymentName: string, namespace: string) {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AppsV1Api);
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
