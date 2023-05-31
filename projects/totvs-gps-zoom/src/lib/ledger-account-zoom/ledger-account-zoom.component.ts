import { Component, Input, EventEmitter, Output } from '@angular/core';
import { GpsOrientation } from '../../utils/enum/gps-orientation.enum';
import { LedgerAccountZoom } from './zoom/ledger-account.zoom';
import { CostCenterZoom } from './zoom/cost-center.zoom';

@Component({
  selector: 'gps-ledger-account-zoom',
  templateUrl: './ledger-account-zoom.component.html'
})
export class LedgerAccountZoomComponent {

  public _ledgerAccount: string;
  public _costCenter: string;

  constructor (
      public ledgerAccountZoom: LedgerAccountZoom,
      public costCenterZoom: CostCenterZoom) {}

  ngOnInit() {}

  @Input('gps-limit-date') limitDate: Date;

  @Input('gps-kind-account-different') kindAccountDifferent: string;

  @Input('gps-orientation') orientation:GpsOrientation = GpsOrientation.Vertical;

  @Input('gps-ledger-account-disabled') disabledLedgerAccount: boolean = false;

  @Input('gps-cost-center-disabled') disabledCostCenter: boolean = false;

  @Input('gps-required') required: boolean = false;

  @Input('gps-ledger-account-label') ledgerAccountLabel: string = 'Conta contábil';
  @Input('gps-cost-center-label') costCenterLabel: string = 'Centro de custo';

  @Input('gps-ledger-account-class') ledgerAccountClass: string;
  @Input('gps-cost-center-class') costCenterClass: string;

  @Output('gps-change-ledger-account') _onChangeLedgerAccount = new EventEmitter<any>();
  @Output('gps-change-cost-center') _onChangeCostCenter = new EventEmitter<any>();

  @Output('gps-selected-ledger-account') _onSelectedLedgerAccount = new EventEmitter<any>();
  @Output('gps-selected-cost-center') _onSelectedCostCenter = new EventEmitter<any>();

  @Output() gpsLedgerAccountModelChange = new EventEmitter<any>();
  @Input()
    get gpsLedgerAccountModel(): string { return this._ledgerAccount; }
    set gpsLedgerAccountModel(ledgerAccount: string) {
      this._ledgerAccount = ledgerAccount;
      this.gpsLedgerAccountModelChange.emit(this._ledgerAccount);
    }

  @Output() gpsCostCenterModelChange = new EventEmitter<any>();
  @Input()
    get gpsCostCenterModel(): string { return this._costCenter; }
    set gpsCostCenterModel(costCenter: string) {
      this._costCenter = costCenter;
      this.gpsCostCenterModelChange.emit(this._costCenter);
    }

  onChangeLedgerAccount(event) {
    if(this.disabledLedgerAccount === true){
      return;
    }

    if(this._onChangeLedgerAccount) {
      this._onChangeLedgerAccount.emit(event);
    }
  }

  onSelectLedgerAccount(event) {
    if(this.disabledLedgerAccount === true) {
      return;
    }

    if(this._onSelectedLedgerAccount) {
      this._onSelectedLedgerAccount.emit(event);
    }
  }

  onChangeCostCenter(event) {
    if(this.disabledCostCenter === true) {
      return;
    }
    if(this._onChangeCostCenter) {
      this._onChangeCostCenter.emit(event);
    }
  }

  onSelectCostCenter(event) {
    if(this.disabledCostCenter === true) {
      return;
    }
    if(this._onSelectedCostCenter) {
      this._onSelectedCostCenter.emit(event);
    }
  }
}
