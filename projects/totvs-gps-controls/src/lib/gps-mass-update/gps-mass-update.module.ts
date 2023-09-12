import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { GpsMassUpdateComponent } from './gps-mass-update.component';
import { ExportComponent } from './export/export.component';
import { GpsMassUpdateService } from './service/gps-mass-update.service';
import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoadComponent } from './load/load.component';
import { CheckingExecuteComponent } from './checking-execute/checking-execute.component';


@NgModule({
  bootstrap: [GpsMassUpdateComponent],
  imports: [
    PoModule,
    PoFieldModule,
    CommonModule,
    FormsModule 
  ],
  declarations: [
    ExportComponent,
    LoadComponent,
    CheckingExecuteComponent,
    GpsMassUpdateComponent,
  ],
  exports: [
    GpsMassUpdateComponent,
  ],
  providers: [
    GpsMassUpdateService
  ]
})
export class GpsMassUpdateModule { }
