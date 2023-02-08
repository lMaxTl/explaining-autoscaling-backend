import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusMetricsController } from './prometheus-metrics.controller';

describe('PrometheusMetricsController', () => {
  let controller: PrometheusMetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrometheusMetricsController],
    }).compile();

    controller = module.get<PrometheusMetricsController>(
      PrometheusMetricsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
