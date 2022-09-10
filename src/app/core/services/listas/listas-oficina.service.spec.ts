import { TestBed } from '@angular/core/testing';

import { ListasOficinaService } from './listas-oficina.service';

describe('ListasOficinaService', () => {
  let service: ListasOficinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListasOficinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
