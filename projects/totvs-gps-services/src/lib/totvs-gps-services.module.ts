import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TotvsGpsDataService } from './totvs-gps-services.service';
import { TotvsGpsInterceptorService } from './totvs-gps-interceptor.service';
import { PermissionResolver, PermissionService } from './totvs-gps-permission.service';

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
    PermissionService,
    PermissionResolver
  ]
})
export class TotvsGpsServicesModule { 

  GpsServices:TotvsGpsDataService;

  constructor(private gpsServices: TotvsGpsDataService) {
    GPS_SERVICES = this.gpsServices;
    this.GpsServices = GPS_SERVICES;
  }  

}
