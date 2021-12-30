import { TestBed } from '@angular/core/testing';

import { OffAuthService } from './off-auth.service';

describe('OffAuthService', () => {
  let service: OffAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
