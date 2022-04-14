import { Component, forwardRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
    @Input() input: any;
    @Input('gps-modality') modality: number;
    @Input('gps-disabled') disabled: boolean;

    private _value:any;
    public literals: PoLookupLiterals = {
      modalPlaceholder: 'Proposta ou contrato'
    };

    public get myValue(): string { return this._value }
    public set myValue(v: string) {
        
        if (v !== this._value) {     
            this._value = v;
            this.onChange(v);
        }
    }
    
    

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

    constructor(public contractZoom: ContractZoomService) { 
        
    }

    ngOnInit() {        
        
    }

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

}