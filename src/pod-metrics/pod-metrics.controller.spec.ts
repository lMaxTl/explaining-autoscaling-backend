import { Test, TestingModule } from '@nestjs/testing';
import { PodMetricsController } from './pod-metrics.controller';

describe('PodMetricsController', () => {
  let controller: PodMetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodMetricsController],
    }).compile();

    controller = module.get<PodMetricsController>(PodMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
