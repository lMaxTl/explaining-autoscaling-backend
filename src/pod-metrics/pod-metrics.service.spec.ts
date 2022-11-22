import { Test, TestingModule } from '@nestjs/testing';
import { PodMetricsService } from './pod-metrics.service';

describe('PodMetricsService', () => {
  let service: PodMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodMetricsService],
    }).compile();

    service = module.get<PodMetricsService>(PodMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
