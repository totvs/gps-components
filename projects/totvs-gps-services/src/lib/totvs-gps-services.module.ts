import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TotvsGpsServicesService } from './totvs-gps-services.service';

export let GPS_SERVICES: TotvsGpsServicesService;

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [TotvsGpsServicesService]
})
export class TotvsGpsServicesModule { 

  constructor(private gpsServices: TotvsGpsServicesService) {
    GPS_SERVICES = this.gpsServices;
  }

}
