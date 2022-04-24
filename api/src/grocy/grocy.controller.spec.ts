import { Test, TestingModule } from '@nestjs/testing';
import { GrocyController } from './grocy.controller';

describe('GrocyController', () => {
  let controller: GrocyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrocyController],
    }).compile();

    controller = module.get<GrocyController>(GrocyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
