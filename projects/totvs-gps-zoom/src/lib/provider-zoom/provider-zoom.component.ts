import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HealthInsurerZoomService } from './health-insurer-zoom.service';
import { HealthProviderZoomService } from './provider-zoom.service';
import { GpsOrientation } from '../../utils/enum/gps-orientation.enum';

@Component({
  selector: 'gps-provider-zoom',
  templateUrl: './provider-zoom.component.html'
})
export class ProviderZoomComponent {

  public _healthInsurer: number;
  public _provider: number;

  constructor (
      public healthInsurerZoom: HealthInsurerZoomService,
      public providerZoom: HealthProviderZoomService) {}

  ngOnInit() {}    

  @Input('gps-orientation') orientation:GpsOrientation = GpsOrientation.Vertical;

  //Indica se o componente aceita o 0 como sendo "Todos"
  @Input('gps-has-zero-all') hasZeroAll:boolean = true;

  //Se indicado true, irá filtrar na preserv, com a dt-exclusão = ?, caso seja false, filtrará por dt-exclusão <> ?
  @Input('gps-only-active-provider') onlyActiveProvider:boolean = null;

  @Input('gps-disabled') disabled: boolean = false;
  @Input('gps-required') required: boolean = false;
    
  @Input('gps-health-insurer-class') healthInsurerClass: string;
  @Input('gps-health-provider-class') providerClass: string;

  @Output('gps-change-health-insurer') _onChangeHealthInsurer = new EventEmitter<any>();
  @Output('gps-change-provider') _onChangeProvider = new EventEmitter<any>();

  @Output('gps-selected-health-insurer') _onSelectedHealthInsurer = new EventEmitter<any>();
  @Output('gps-selected-provider') _onSelectedProvider = new EventEmitter<any>();  
  
  @Output('gps-health-insurer-modelChange') gpsHealthInsurerModelChange = new EventEmitter<any>();
  @Input('gps-health-insurer-model')
    get gpsHealthInsurerModel(): number { return this._healthInsurer; }
    set gpsHealthInsurerModel(healthInsurer: number) {
      this._healthInsurer = healthInsurer;
      this.gpsHealthInsurerModelChange.emit(this._healthInsurer);
    }

  @Output('gps-health-provider-modelChange') gpsProviderModelChange = new EventEmitter<any>();
  @Input('gps-health-provider-model')
    get gpsProviderModel(): number { return this._provider; }
    set gpsProviderModel(provider: number) {
      this._provider = provider;
      this.gpsProviderModelChange.emit(this._provider)
    }

  onChangeHealthInsurer(event) {
    if(this.disabled === true){
      return;
    }
    this._provider = null;
    if(this._onChangeHealthInsurer)
      this._onChangeHealthInsurer.emit(event);
  }

  onChangeProvider(event) {
    if(this._onChangeProvider)
      this._onChangeProvider.emit(event);
  }

  onSelectedHealthInsurer(event) {
    if(this.disabled === true){
      return;
    }
    this._provider = null;
    if(this._onSelectedHealthInsurer)
      this._onSelectedHealthInsurer.emit(event);
  }

  onSelectedProvider(event) {
    if(this._onSelectedProvider)
      this._onSelectedProvider.emit(event);
  }

}
