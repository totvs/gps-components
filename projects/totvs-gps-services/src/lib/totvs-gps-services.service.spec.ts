import { TestBed } from '@angular/core/testing';

import { TotvsGpsServicesService } from './totvs-gps-services.service';

describe('TotvsGpsServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TotvsGpsServicesService = TestBed.get(TotvsGpsServicesService);
    expect(service).toBeTruthy();
  });
});
