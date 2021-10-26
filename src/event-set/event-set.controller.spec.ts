import { Test, TestingModule } from '@nestjs/testing';
import { EventSetController } from './event-set.controller';

describe('EventSetController', () => {
  let controller: EventSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventSetController],
    }).compile();

    controller = module.get<EventSetController>(EventSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
