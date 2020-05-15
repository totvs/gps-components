import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TotvsGpsDataService } from './totvs-gps-services.service';
import { TotvsGpsInterceptorService } from './totvs-gps-interceptor.service';

export let GPS_SERVICES: TotvsGpsDataService;

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  providers: [
    TotvsGpsDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TotvsGpsInterceptorService,
      multi: true
    },
  ]
})
export class TotvsGpsServicesModule { 

  constructor(private gpsServices: TotvsGpsDataService) {
    GPS_SERVICES = this.gpsServices;
  }

  get GpsServices(): TotvsGpsDataService {
    return GPS_SERVICES;
  }

}
