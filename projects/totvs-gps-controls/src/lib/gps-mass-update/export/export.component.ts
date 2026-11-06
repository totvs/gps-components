import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';
import { Export } from '../models/export';
import { GpsMassUpdateService } from '../service/gps-mass-update.service';
import { alignFooterToCard } from '../footer-alignment';

@Component({
    selector: 'export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.css'],
    standalone: false
})
export class ExportComponent implements OnInit, AfterViewInit {

  @Input('gps-url') gpsUrl: string;
  @Input('gps-headers') gpsHeaders: Object;

  @Input('filter')
    get parameterGpsFilter() { return this._parameterGpsFilter }
    set parameterGpsFilter(value) { this._parameterGpsFilter = value; }
  @Output('filterChange') onGpsFilterChange: EventEmitter<any> = new EventEmitter();

  @Output('gps-pass-export') gpsPassExport: EventEmitter<any> = new EventEmitter();

  private _parameterGpsFilter;
  exportOptions: PoRadioGroupOption[] = [
    { label: 'Layout em branco', value: 1 },
    { label: 'Layout com dados para atualização', value: 2 }
  ];

  exportType: number = 1;

  loadingMessage: string = "Exportando...";
  isLoading: boolean = false;

  constructor(
    private service: GpsMassUpdateService,
    private notificationService: PoNotificationService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    alignFooterToCard(document.getElementById('export-footer'));
  }

  onExport(){
    this.showLoading();
    
    let promise: Promise<Export>;
    promise = this.exportType == 1 ? this.service.exportEmpty(this.gpsUrl, this.gpsHeaders) : this.service.exportByFilter(this._parameterGpsFilter, this.gpsUrl, this.gpsHeaders);

    promise.then(result =>{
      this.notificationService.success(`Layout exportado com sucesso. Arquivo ${result.fileName} enviado para a Central de documentos.`);
    })
    .finally(() =>{
      this.hideLoading();
    });
  }

  showLoading(message?){
    if(message){
      this.loadingMessage = message;
    }
    this.isLoading = true;
  }
  hideLoading(){
    this.isLoading = false;
  }

  onPassExport(){
    this.gpsPassExport.emit()
  }

}
