import { Test, TestingModule } from '@nestjs/testing';
import { ScalingConditionsService } from './scaling-conditions.service';

describe('ScalingConditionsService', () => {
  let service: ScalingConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScalingConditionsService],
    }).compile();

    service = module.get<ScalingConditionsService>(ScalingConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
