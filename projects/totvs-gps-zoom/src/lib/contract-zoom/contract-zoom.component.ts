import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PoDynamicFormField, PoLookupLiterals, PoSwitchLabelPosition } from '@po-ui/ng-components';
import { ContractZoomService } from './contract-zoom.service';

@Component({
  selector: 'gps-contract-zoom',
  templateUrl: './contract-zoom.component.html',
  styleUrls: []
})
export class ContractZoomComponent {

    private _value: any;
    
    @Input() toggleLabel: string = 'Todos';
    @Input() labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;
    @Input('gps-modality') modality: number;
    @Input('gps-disabled') disabled: boolean;
    @Input('gps-enable-switch') enableSwitch: boolean = false;
    @Input() lookupClassSwitchInvisible: string = "po-sm-12 po-md-12 po-lg-12 po-xl-12";
    @Input() lookupClassSwitchVisible: string = "po-sm-8 po-md-8 po-lg-8 po-xl-8";

    @Output() gpsModelChange = new EventEmitter<any>();
    @Input()
      get gpsModel() { return this._value; }
      set gpsModel(value) { this._value = value; this.gpsModelChange.emit(this._value) }

    @Output('gps-change') onGpsChange = new EventEmitter<any>();
    @Output('gps-selected') onGpsSelected = new EventEmitter<any>();
    @Output('gps-change-toggle') onChangeToggle = new EventEmitter<any>();

    public literals: PoLookupLiterals = {
      modalPlaceholder: 'Proposta ou contrato'
    };

    @Input('gps-all-contracts') gpsAllContracts:boolean = false;
    @Input('gps-only-proposals-special-age-range') gpsOnlyProposalsSpecialAgeRange:boolean = false;
    @Input('gps-only-current') gpsOnlyCurrent:boolean = false;

    advancedFilters: Array<PoDynamicFormField> = [
      { property: 'proposalInitial', optional: true, gridColumns: 12, label: 'Proposta inicial' },
      { property: 'contractInitial', optional: true, gridColumns: 12, label: 'Contrato inicial' },
      { property: 'guarantorNameInitial', optional: true, gridColumns: 12, label: 'Nome do contratante' },
      { property: 'guarantorInitial', optional: true, gridColumns: 12, label: 'Código do contratante inicial' },
      { property: 'sourceGuarantorNameInitial', optional: true, gridColumns: 12, label: 'Nome do contratante origem' },
      { property: 'status', optional: true, gridColumns: 12, label: '', type: 'boolean', 
        options: [
          {label: 'Somente ativos', value: 'Somente ativos'},
          {label: 'Todos', value: 'Todos', }
        ] 
      },
    ];

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(public contractZoom: ContractZoomService) { }    
    
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }
    
    writeValue(input: any) {
    }

    onChangeContract(event) {
      if(this.onGpsChange) {
        this.onGpsChange.emit(event);
      }
    }

    onSelectedContract(event) {
      if(this.onGpsSelected) {
        this.onGpsSelected.emit(event);
      }
    }

    handlerToggleChange(active: boolean) {
      this._value = active ? '0' : undefined;
      this.onChange(this._value);
      if(this.onChangeToggle){
        this.onChangeToggle.emit(this._value)
      }
    }

    get value() {
      return this._value;
    }
}
