import { TestBed } from '@angular/core/testing';

import { DocumentsOnService } from './documents-on.service';

describe('DocumentsOnService', () => {
  let service: DocumentsOnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsOnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
