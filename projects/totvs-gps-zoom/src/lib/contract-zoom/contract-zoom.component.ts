import { Component, forwardRef, Input, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PoDynamicFormField, PoLookupLiterals } from '@po-ui/ng-components';
import { ContractZoomService } from './contract-zoom.service';

@Component({
  selector: 'gps-contract-zoom',
  templateUrl: './contract-zoom.component.html',
  styleUrls: ['./contract-zoom.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContractZoomComponent),
      multi: true
    }
  ]
})
export class ContractZoomComponent implements OnInit, ControlValueAccessor {

    private _value:any;

    @Input() input: any;
    @Input('gps-modality') modality: number;
    @Input('gps-disabled') disabled: boolean;

    @Output() gpsModelChange = new EventEmitter<any>();
    @Input()
      get gpsModel() { return this._value; }
      set gpsModel(value) { this._value = value; this.gpsModelChange.emit(this._value) }

    @Output('gps-change') onGpsChange = new EventEmitter<any>();
    
    public literals: PoLookupLiterals = {
      modalPlaceholder: 'Proposta ou contrato'
    };

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

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
      if(changes.modality && changes.modality.currentValue != changes.modality.previousValue){
          this.clearFields();
      }
    }

    clearFields(){       
      this.input = null;
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
    
    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }
    
    writeValue(input: any) {
      this.input = input;      
    }

    onChangeContract(event) {
      if(this.onGpsChange) {
        this.onGpsChange.emit(event);
      }
    }
}
