import { Injectable } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class DeploymentInformationService {
    private kubernetesConfig = new k8s.KubeConfig();

    constructor() {
        this.kubernetesConfig.loadFromDefault();
    }

    /**
     * Retrieves information about the replica size, currently active replicas and stauts of an deployment from the kubernetes API.
     * 
     * @param deploymentName
     * @param namespace
     * @returns
     */
    async getDeploymentInformation(namespace: string, deploymentName: string) {        
        const k8sApi = this.kubernetesConfig.makeApiClient(k8s.AppsV1Api);
        const deployment = await k8sApi.readNamespacedDeployment(deploymentName, namespace);
        const deploymentStatus = deployment.body.status;
        const deploymentInformation = {
            replicas: deploymentStatus.replicas,
            availableReplicas: deploymentStatus.availableReplicas,
            unavailableReplicas: deploymentStatus.unavailableReplicas,
            conditions: deploymentStatus.conditions,
        }
        return deploymentInformation;
    }

}
