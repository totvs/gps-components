import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThfModule } from '@totvs/thf-ui';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';
import { GpsExportDataComponent } from './gps-export-data/gps-export-data.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ThfModule
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
