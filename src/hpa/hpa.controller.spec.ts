import { Test, TestingModule } from '@nestjs/testing';
import { HpaController } from './hpa.controller';

describe('HpaController', () => {
  let controller: HpaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HpaController],
    }).compile();

    controller = module.get<HpaController>(HpaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
