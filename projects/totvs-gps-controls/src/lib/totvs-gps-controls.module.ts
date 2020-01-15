import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@portinari/portinari-ui';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';
import { GpsExportDataComponent } from './gps-export-data/gps-export-data.component';
import { GpsRpwComponent } from './gps-rpw/gps-rpw.component';
import { TotvsGpsServicesModule } from 'totvs-gps-services';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    PoModule,
    TotvsGpsServicesModule
  ],
  declarations: [
    GpsOrderListComponent,
    GpsExportDataComponent,
    GpsRpwComponent
  ],
  exports: [
    GpsOrderListComponent,
    GpsExportDataComponent,
    GpsRpwComponent
  ]
})
export class TotvsGpsControlsModule { }
