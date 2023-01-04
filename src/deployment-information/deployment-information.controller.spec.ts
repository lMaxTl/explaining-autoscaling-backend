import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentInformationController } from './deployment-information.controller';

describe('DeploymentInformationController', () => {
  let controller: DeploymentInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeploymentInformationController],
    }).compile();

    controller = module.get<DeploymentInformationController>(DeploymentInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
