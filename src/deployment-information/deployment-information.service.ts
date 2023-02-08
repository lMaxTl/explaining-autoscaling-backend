import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as k8s from '@kubernetes/client-node';
import {
  DeploymentInformation,
  DeploymentInformationDocument,
} from 'src/schema/deploymentInformation.schema';

/**
 * Service for retrieving deployment information from the kubernetes API and saving it in the database.
 */
@Injectable()
export class DeploymentInformationService {
  private kubernetesConfig = new k8s.KubeConfig();

  constructor(
    @InjectModel(DeploymentInformation.name)
    private deploymentInformationModel: Model<DeploymentInformationDocument>,
  ) {
    this.kubernetesConfig.loadFromDefault();
    this.saveDeploymentInformation();
  }

  /**
   * Returns all deployment information from the database.
   *
   * @returns
   */
  async getAllDeploymentInformation() {
    return this.deploymentInformationModel.find().exec();
  }

  /**
   * Returns the deployment information for a given deployment name in a given namespace closest to a specific time.
   *
   * @param deploymentName
   * @param namespace
   * @returns
   */
  async getDeploymentInformationByTime(
    deploymentName: string,
    namespace: string,
    timestamp: Date,
  ) {
    const timeBias = 240000;
    timestamp.setMilliseconds(timestamp.getMilliseconds() + timeBias);
    return this.deploymentInformationModel
      .findOne({
        deploymentName: deploymentName,
        namespace: namespace,
        createdAt: { $lte: timestamp },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Saves the deployment information in the database.
   *
   * @returns
   */
  async saveDeploymentInformation() {
    const deploymentsUnfiltered = await this.getDeployments('default');
    const deployments = this.filterDeployments(deploymentsUnfiltered);

    for (const deployment of deployments) {
      const deploymentInformation = await this.getDeploymentInformation(
        deployment.metadata.namespace,
        deployment.metadata.name,
      );
      const deploymentInformationDocument = new this.deploymentInformationModel(
        {
          _id: new Types.ObjectId(),
          deploymentName: deployment.metadata.name,
          namespace: deployment.metadata.namespace,
          createdAt: new Date().toISOString(),
          replicas: deploymentInformation.replicas,
          availableReplicas: deploymentInformation.availableReplicas,
          unavailableReplicas: deploymentInformation.unavailableReplicas,
          conditions: deploymentInformation.conditions,
        },
      );
      await deploymentInformationDocument.save();
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
   * Removes blacklisted deployments from the list of deployments.
   *
   * The blacklist includes the following deployments:
   * - the backend and frontend of the application, mongodb, prometheus and grafana
   *
   * @param deploymentsUnfiltered deployments
   * @returns
   */
  private filterDeployments(deploymentsUnfiltered: k8s.V1Deployment[]) {
    const deploymentBlacklist = [
      'ba',
      'ba-frontend',
      'blackbox-exporter-prometheus-blackbox-exporter',
      'mongo-mongodb',
      'prometheus-grafana',
      'prometheus-kube-prometheus-operator',
      'prometheus-kube-state-metrics',
    ];
    const deployments = [];

    for (const deployment of deploymentsUnfiltered) {
      if (!deploymentBlacklist.includes(deployment.metadata.name)) {
        deployments.push(deployment);
      }
    }
    return deployments;
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
    const deployment = await k8sApi.readNamespacedDeployment(
      deploymentName,
      namespace,
    );
    const deploymentStatus = deployment.body.status;
    const deploymentInformation = {
      replicas: deploymentStatus.replicas,
      availableReplicas: deploymentStatus.availableReplicas,
      unavailableReplicas: deploymentStatus.unavailableReplicas,
      conditions: deploymentStatus.conditions,
    };
    return deploymentInformation;
  }
}
