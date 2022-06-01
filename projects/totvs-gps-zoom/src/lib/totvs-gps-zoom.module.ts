import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { TotvsGpsServicesModule } from 'totvs-gps-services';
import { BeneficiaryZoomComponent } from './beneficiary-zoom/beneficiary-zoom.component';
import { ContractZoomComponent } from './contract-zoom/contract-zoom.component';
import { ContractZoomService } from './contract-zoom/contract-zoom.service';
import { AuthorizationZoomComponent } from './authorization-zoom/authorization-zoom.component';
import { AuthorizationZoomService } from './authorization-zoom/authorization-zoom.service';
import { GuideService, HealthProviderService, UnityService, CostCenterService, LedgerAccountService } from 'totvs-gps-api';
import { ProviderZoomComponent } from './provider-zoom/provider-zoom.component';
import { HealthInsurerZoomService } from './provider-zoom/health-insurer-zoom.service';
import { HealthProviderZoomService } from './provider-zoom/provider-zoom.service';
import { LedgerAccountZoomComponent } from './ledger-account-zoom/ledger-account-zoom.component';
import { LedgerAccountZoom } from './ledger-account-zoom/zoom/ledger-account.zoom';
import { CostCenterZoom } from './ledger-account-zoom/zoom/cost-center.zoom';

const components = [
  BeneficiaryZoomComponent,
  ContractZoomComponent,
  AuthorizationZoomComponent,
  ProviderZoomComponent,
  LedgerAccountZoomComponent
];
const directives = [
];
const pipes = [
];
const providers = [
  ContractZoomService,
  AuthorizationZoomService,
  GuideService,
  HealthInsurerZoomService,
  HealthProviderZoomService,
  UnityService,
  HealthProviderService,
  LedgerAccountZoom,
  CostCenterZoom,
  CostCenterService,
  LedgerAccountService
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
