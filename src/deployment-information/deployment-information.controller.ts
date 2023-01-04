import { Controller, Get, Param } from '@nestjs/common';
import { DeploymentInformationService } from './deployment-information.service';

@Controller('deployment-information')
export class DeploymentInformationController {
    constructor(private readonly deploymentInformationService: DeploymentInformationService) { }

    @Get('/:namespace/:deploymentName')
    getDeploymentInformation(@Param('namespace') namespace: string, @Param('deploymentName') deploymentName: string) {
        var deploymentInformation = this.deploymentInformationService.getDeploymentInformation(namespace, deploymentName);
        return deploymentInformation;
    }
}
