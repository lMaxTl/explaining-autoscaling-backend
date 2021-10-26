import { Test, TestingModule } from '@nestjs/testing';
import { EventSetService } from './event-set.service';

describe('EventSetService', () => {
  let service: EventSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSetService],
    }).compile();

    service = module.get<EventSetService>(EventSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
