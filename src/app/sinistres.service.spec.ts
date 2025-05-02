import { TestBed } from '@angular/core/testing';

import { SinistresService } from './sinistres.service';

describe('SinistresService', () => {
  let service: SinistresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinistresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
