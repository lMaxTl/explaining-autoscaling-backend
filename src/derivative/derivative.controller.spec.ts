import { Test, TestingModule } from '@nestjs/testing';
import { DerivativeController } from './derivative.controller';

describe('DerivativeController', () => {
  let controller: DerivativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerivativeController],
    }).compile();

    controller = module.get<DerivativeController>(DerivativeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
