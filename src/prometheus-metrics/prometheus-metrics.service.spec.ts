import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusMetricsService } from './prometheus-metrics.service';

describe('PrometheusMetricsService', () => {
  let service: PrometheusMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrometheusMetricsService],
    }).compile();

    service = module.get<PrometheusMetricsService>(PrometheusMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
