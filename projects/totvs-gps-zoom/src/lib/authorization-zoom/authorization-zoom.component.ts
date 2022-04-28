import { Component, Input, EventEmitter, Output } from '@angular/core';
import { PoDynamicFormField, PoLookupLiterals } from '@po-ui/ng-components';
import { AuthorizationZoomService } from './authorization-zoom.service';

@Component({
  selector: 'gps-authorization-zoom',
  templateUrl: './authorization-zoom.component.html',
  styleUrls: ['./authorization-zoom.component.css']
})
export class AuthorizationZoomComponent {

    private _value:any;
    
    @Input('gps-disabled') disabled: boolean;

    @Output() gpsModelChange = new EventEmitter<any>();
    @Input()
      get gpsModel() { return this._value; }
      set gpsModel(value) { this._value = value; this.gpsModelChange.emit(this._value) }

    @Output('gps-change') onGpsChange = new EventEmitter<any>();
    @Output('gps-selected') onGpsSelected = new EventEmitter<any>();
    
    public literals: PoLookupLiterals = {
      modalPlaceholder: 'Ano/guia de autorização'
    };

    advancedFilters: Array<PoDynamicFormField> = [      
      { property: 'emissionDateInitial', type: 'date', optional: true, gridColumns: 6, label: 'Data de emissão inicial' },
      { property: 'emissionDateFinal', type: 'date', optional: true, gridColumns: 6, label: 'Data de emissão final' },
      { property: 'healthInsuranceCompanyInitial', optional: true, gridColumns: 6, label: 'Unidade da carteira inicial' },
      { property: 'healthInsuranceCompanyFinal', optional: true, gridColumns: 6, label: 'Unidade da carteira final' },
      { property: 'cardNumberInitial', optional: true, gridColumns: 6, label: 'Carteira do beneficiário inicial' },
      { property: 'cardNumberFinal', optional: true, gridColumns: 6, label: 'Carteira do beneficiário final' },
      { property: 'modality', optional: true, gridColumns: 6, label: 'Modalidade' },
      { property: 'contract', optional: true, gridColumns: 6, label: 'Contrato' },
    ];

    onChange: any = () => {};
    onTouch: any = () => {};

    constructor(public authorizationZoom: AuthorizationZoomService) { }    
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }
    
    writeValue(input: any) {
    }

    onChangeAuthorization(event) {
      if(this.onGpsChange) {
        this.onGpsChange.emit(event);
      }
    }

    onSelectAuthorization(event) {
      if(this.onGpsSelected) {
        this.onGpsSelected.emit(event);
      }
    }
}
