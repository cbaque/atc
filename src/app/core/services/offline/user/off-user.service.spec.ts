import { TestBed } from '@angular/core/testing';

import { OffUserService } from './off-user.service';

describe('OffUserService', () => {
  let service: OffUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
