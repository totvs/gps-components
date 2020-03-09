import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@portinari/portinari-ui';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';
import { GpsExportDataComponent } from './gps-export-data/gps-export-data.component';
import { GpsRpwComponent } from './gps-rpw/gps-rpw.component';
import { TotvsGpsServicesModule } from 'totvs-gps-services';
import { GpsAdvancedSearchDirective } from './gps-page/directives/gps-advanced-search.directive';
import { GpsPageListComponent } from './gps-page/gps-page-list/gps-page-list.component';

const components = [
  GpsOrderListComponent,
  GpsExportDataComponent,
  GpsRpwComponent,
  GpsPageListComponent
];
const directives = [
  GpsAdvancedSearchDirective
]

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    PoModule,
    TotvsGpsServicesModule
  ],
  declarations: [
    ...components,
    ...directives
  ],
  exports: [
    ...components,
    ...directives
  ]
})
export class TotvsGpsControlsModule { }
