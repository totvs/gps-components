import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { GpsOrderListComponent } from './gps-order-list/gps-order-list.component';
import { GpsExportDataComponent } from './gps-export-data/gps-export-data.component';
import { GpsModelFillComponent } from './gps-model-fill/gps-model-fill.component';
import { GpsRpwComponent } from './gps-rpw/gps-rpw.component';
import { TotvsGpsServicesModule } from 'totvs-gps-services';
import { GpsAdvancedSearchDirective } from './gps-page/directives/gps-advanced-search.directive';
import { GpsPageListComponent } from './gps-page/gps-page-list/gps-page-list.component';
import { GpsPageDetailComponent } from './gps-page/gps-page-detail/gps-page-detail.component';
import { GpsPageEditComponent } from './gps-page/gps-page-edit/gps-page-edit.component';
import { BooleanPipe } from './pipes/boolean.pipe';

const components = [
  GpsOrderListComponent,
  GpsExportDataComponent,
  GpsModelFillComponent,
  GpsRpwComponent,
  GpsPageListComponent,
  GpsPageDetailComponent,
  GpsPageEditComponent
];
const directives = [
  GpsAdvancedSearchDirective
];
const pipes = [
  BooleanPipe
];

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
    ...directives,
    ...pipes
  ],
  exports: [
    ...components,
    ...directives,
    ...pipes
  ]
})
export class TotvsGpsControlsModule { }
