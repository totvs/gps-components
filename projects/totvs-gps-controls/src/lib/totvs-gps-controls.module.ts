import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@portinari/portinari-ui';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';
import { GpsExportDataComponent } from './gps-export-data/gps-export-data.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    PoModule
  ],
  declarations: [
    GpsOrderListComponent,
    GpsExportDataComponent
  ],
  exports: [
    GpsOrderListComponent,
    GpsExportDataComponent
  ]
})
export class TotvsGpsControlsModule { }
