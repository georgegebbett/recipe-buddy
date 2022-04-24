import { Test, TestingModule } from '@nestjs/testing';
import { GrocyService } from './grocy.service';

describe('GrocyService', () => {
  let service: GrocyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrocyService],
    }).compile();

    service = module.get<GrocyService>(GrocyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
