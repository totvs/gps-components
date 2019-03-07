import { TestBed } from '@angular/core/testing';

import { TotvsGpsControls } from './totvs-gps-controls.component';

describe('TotvsGpsControls', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TotvsGpsControls = TestBed.get(TotvsGpsControls);
    expect(service).toBeTruthy();
  });
});
