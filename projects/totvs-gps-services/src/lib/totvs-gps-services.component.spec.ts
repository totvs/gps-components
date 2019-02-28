import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotvsGpsServicesComponent } from './totvs-gps-services.component';

describe('TotvsGpsServicesComponent', () => {
  let component: TotvsGpsServicesComponent;
  let fixture: ComponentFixture<TotvsGpsServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotvsGpsServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotvsGpsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
