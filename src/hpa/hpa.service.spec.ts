import { Test, TestingModule } from '@nestjs/testing';
import { HpaService } from './hpa.service';

describe('HpaService', () => {
  let service: HpaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HpaService],
    }).compile();

    service = module.get<HpaService>(HpaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
