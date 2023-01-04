import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentInformationService } from './deployment-information.service';

describe('DeploymentInformationService', () => {
  let service: DeploymentInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeploymentInformationService],
    }).compile();

    service = module.get<DeploymentInformationService>(DeploymentInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
