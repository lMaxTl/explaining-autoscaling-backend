import { Test, TestingModule } from '@nestjs/testing';
import { DerivativeService } from './derivative.service';

describe('DerivativeService', () => {
  let service: DerivativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DerivativeService],
    }).compile();

    service = module.get<DerivativeService>(DerivativeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
