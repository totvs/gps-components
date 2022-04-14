import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { TotvsGpsServicesModule } from 'totvs-gps-services';
import { BeneficiaryZoomComponent } from './beneficiary-zoom/beneficiary-zoom.component';
import { ContractZoomComponent } from './contract-zoom/contract-zoom.component';
import { ContractZoomService } from './contract-zoom/contract-zoom.service';

const components = [
  BeneficiaryZoomComponent,
  ContractZoomComponent
];
const directives = [
];
const pipes = [
];
const providers = [
  ContractZoomService
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
  ],
  providers:[
    ...providers
  ]
})
export class TotvsGpsZoomModule { }
