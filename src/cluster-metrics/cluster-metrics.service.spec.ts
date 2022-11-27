import { Test, TestingModule } from '@nestjs/testing';
import { ClusterMetricsService } from './cluster-metrics.service';

describe('ClusterMetricsService', () => {
  let service: ClusterMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClusterMetricsService],
    }).compile();

    service = module.get<ClusterMetricsService>(ClusterMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
