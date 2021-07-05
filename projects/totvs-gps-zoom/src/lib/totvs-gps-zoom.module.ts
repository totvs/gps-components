import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { TotvsGpsServicesModule } from 'totvs-gps-services';
import { BeneficiaryZoomComponent } from './beneficiary-zoom/beneficiary-zoom.component';

const components = [
  BeneficiaryZoomComponent
];
const directives = [
];
const pipes = [
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
export class TotvsGpsZoomModule { }
