import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThfModule } from '@totvs/thf-ui';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ThfModule
  ],
  declarations: [
    GpsOrderListComponent
  ],
  exports: [
    GpsOrderListComponent
  ]
})
export class TotvsGpsControlsModule { }
