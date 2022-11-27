import { Test, TestingModule } from '@nestjs/testing';
import { ClusterMetricsController } from './cluster-metrics.controller';

describe('ClusterMetricsController', () => {
  let controller: ClusterMetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClusterMetricsController],
    }).compile();

    controller = module.get<ClusterMetricsController>(ClusterMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
