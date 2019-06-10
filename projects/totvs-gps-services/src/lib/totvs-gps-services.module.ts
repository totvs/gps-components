import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TotvsGpsServicesService } from './totvs-gps-services.service';
import { TotvsGpsInterceptorService } from './totvs-gps-interceptor.service';

export let GPS_SERVICES: TotvsGpsServicesService;

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [
    TotvsGpsServicesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TotvsGpsInterceptorService,
      multi: true
    },
  ]
})
export class TotvsGpsServicesModule { 

  constructor(private gpsServices: TotvsGpsServicesService) {
    GPS_SERVICES = this.gpsServices;
  }

  get GpsServices(): TotvsGpsServicesService {
    return GPS_SERVICES;
  }

}
