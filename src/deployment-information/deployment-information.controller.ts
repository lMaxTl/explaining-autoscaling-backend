import { Controller, Get, Param } from '@nestjs/common';
import { DeploymentInformationService } from './deployment-information.service';

/**
 * Controller for retrieving deployment information
 */
@Controller('deployment-information')
export class DeploymentInformationController {
    constructor(private readonly deploymentInformationService: DeploymentInformationService) { }

    /**
     * Returns the deployment information for the given deployment name and namespace at the given timestamp
     * 
     * The deployment information includes the id, the deployment name, the namespace, the time of information collection, the number of replicas, the number of available replicas, the number of unavailable replicas and the conditions.
     * 
     * @param namespace
     * @param deploymentName
     * @param timestamp
     * @returns
     */
    @Get('/:namespace/:deploymentName/:timestamp')
    getDeploymentInformation(@Param('namespace') namespace: string, @Param('deploymentName') deploymentName: string, @Param('timestamp') timestamp: string) {
        let deploymentInformation = this.deploymentInformationService.getDeploymentInformationByTime(deploymentName, namespace, new Date());
        return deploymentInformation;
    }
}
