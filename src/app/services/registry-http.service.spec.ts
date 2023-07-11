import { TestBed } from '@angular/core/testing';

import { RegistryHttpService } from './registry-http.service';

describe('RegistryHttpService', () => {
  let service: RegistryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
