import { Test, TestingModule } from '@nestjs/testing';
import { ScalingConditionsController } from './scaling-conditions.controller';

describe('ScalingConditionsController', () => {
  let controller: ScalingConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScalingConditionsController],
    }).compile();

    controller = module.get<ScalingConditionsController>(
      ScalingConditionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
