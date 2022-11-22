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
    async getPodContainerInformation(namespace: string, podName: string) {
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.CoreV1Api);
        const pod = await k8sApi.readNamespacedPod(podName, namespace);
        const containerStatuses = pod.body.status.containerStatuses;
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

}
