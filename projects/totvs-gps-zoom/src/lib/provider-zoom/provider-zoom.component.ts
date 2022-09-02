import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HealthInsurerZoomService } from './health-insurer-zoom.service';
import { HealthProviderZoomService } from './provider-zoom.service';
import { GpsOrientation } from '../../utils/enum/gps-orientation.enum';
import { PoSwitchLabelPosition } from '@po-ui/ng-components';

@Component({
  selector: 'gps-provider-zoom',
  templateUrl: './provider-zoom.component.html'
})
export class ProviderZoomComponent {

  public _healthInsurer: string;
  public _provider: string;

  constructor (
      public healthInsurerZoom: HealthInsurerZoomService,
      public providerZoom: HealthProviderZoomService) {}

  ngOnInit() {}    

  @Input('gps-orientation') orientation:GpsOrientation = GpsOrientation.Vertical;

  //Indica se o componente aceita o 0 como sendo "Todos" para a unidade do prestador
  @Input('gps-health-insurer-has-zero-all') healthInsurerHasZeroAll:boolean = true;

  //Indica se o componente aceita o 0 como sendo "Todos" para o prestador
  @Input('gps-provider-has-zero-all') providerHasZeroAll:boolean = true;

  //Se indicado true, irá filtrar na preserv, com a dt-exclusão = ?, caso seja false, filtrará por dt-exclusão <> ?
  @Input('gps-only-active-provider') onlyActiveProvider:boolean = null;

  @Input('gps-disabled') disabled: boolean = false;
  @Input('gps-required') required: boolean = false;
    
  @Input('gps-health-insurer-class') healthInsurerClass: string = "po-sm-12 po-md-12 po-lg-12 po-xl-12";
  @Input('gps-health-provider-class') providerClass: string = "po-sm-12 po-md-12 po-lg-12 po-xl-12";

  @Output('gps-change-health-insurer') _onChangeHealthInsurer = new EventEmitter<any>();
  @Output('gps-change-provider') _onChangeProvider = new EventEmitter<any>();

  @Output('gps-selected-health-insurer') _onSelectedHealthInsurer = new EventEmitter<any>();
  @Output('gps-selected-provider') _onSelectedProvider = new EventEmitter<any>();  
  
  @Output('gps-health-insurer-modelChange') gpsHealthInsurerModelChange = new EventEmitter<any>();
  @Input('gps-health-insurer-model')
    get gpsHealthInsurerModel(): string { return this._healthInsurer; }
    set gpsHealthInsurerModel(healthInsurer: string ) {
      this._healthInsurer = healthInsurer;
      this.gpsHealthInsurerModelChange.emit(this._healthInsurer);
    }

  @Output('gps-health-provider-modelChange') gpsProviderModelChange = new EventEmitter<any>();
  @Input('gps-health-provider-model')
    get gpsProviderModel(): string  { return this._provider; }
    set gpsProviderModel(provider: string ) {
      this._provider = provider;
      this.gpsProviderModelChange.emit(this._provider)
    }

  //#region toggle
  //Se indicado true, exibirá o switch 'Todos' para a unidade do prestador. O toggle é exibido apenas na opção vertical
  @Input('gps-enable-switch-health-insurer') enableSwitchHealthInsurer: boolean = false;

  //Se indicado true, exibirá o switch 'Todos' para o prestador. O toggle é exibido apenas na opção vertical
  @Input('gps-enable-switch-provider') enableSwitchProvider: boolean = false;

  @Output('gps-change-health-insurer-toggle') onChangeHealthInsurerToggle = new EventEmitter<any>();
  @Output('gps-change-provider-toggle') onChangeProviderToggle = new EventEmitter<any>();

  @Input('gps-toggle-label') toggleLabel: string = 'Todos';
  @Input('gps-toggle-label-position') labelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Right;
  @Input('gps-health-insurer-class-toggle') healthInsurerClassToggle: string = "po-sm-8 po-md-8 po-lg-8 po-xl-8";
  @Input('gps-health-provider-class-toggle') providerClassToggle: string = "po-sm-8 po-md-8 po-lg-8 po-xl-8";
  //#endregion

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
  handlerHealthInsurerToggleChange(active: boolean) {
    this._healthInsurer = active ? '0' : undefined;
    this.onChangeHealthInsurer(this._healthInsurer);
    if(this.onChangeHealthInsurerToggle){
      this.onChangeHealthInsurerToggle.emit(this._healthInsurer)
    }
    this.handlerProviderToggleChange(active);
  }
  handlerProviderToggleChange(active: boolean) {
    this._provider = active ? '0' : undefined;
    this.onChangeProvider(this._provider);
    if(this.onChangeProviderToggle){
      this.onChangeProviderToggle.emit(this._provider)
    }
  }

}
