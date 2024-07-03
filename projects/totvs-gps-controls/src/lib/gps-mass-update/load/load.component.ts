import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PoNotificationService, PoUploadFileRestrictions, PoDialogService } from '@po-ui/ng-components';
import { GpsMassUpdateService } from '../service/gps-mass-update.service';
import { GpsPageNavigation } from 'totvs-gps-crud';
import { Router } from '@angular/router';

@Component({
  selector: 'load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit, AfterViewInit {

  @Input('gps-url') gpsUrl: string;
  @Input('gps-headers') gpsHeaders: Object;

  loadingMessage: string = "Enviando arquivo...";
  isLoading: boolean = false;

  @Input('gps-selected-file') selectedFile: Array<any> = [];
  importItems:Array<any> = [];

  @Output('gps-back-to-export') gpsBackToExport: EventEmitter<any> = new EventEmitter();
  @Output('gps-on-check-file') gpsOnCheckFile: EventEmitter<any> = new EventEmitter();
  @Output('gps-go-to-check') gpsGoToCheck: EventEmitter<any> = new EventEmitter();

  private pageNavigation:GpsPageNavigation = new GpsPageNavigation();

  uploadUrl: string;
  uploadRestrictions: PoUploadFileRestrictions = {
    allowedExtensions: ['.csv'],
    maxFiles: 1
  }

  disableVisualizationButton: boolean = true;

  constructor(
    private service: GpsMassUpdateService,
    private notificationService: PoNotificationService,
    private dialogService: PoDialogService,
    private router: Router,
  ) {
    this.pageNavigation.setRouter(router);
  }

  ngOnInit(): void {
    this.uploadUrl = this.gpsUrl + '/mass/execute/check';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedFile = null;
  }

  ngAfterViewInit(): void {
    let mainContent:any = document.getElementsByTagName('po-widget')[0];
    let footer = document.getElementById('load-footer');

    //Criação de observer para detectar a mudança de tamanho e recalcular altura da tabela
    const resize_ob = new ResizeObserver((entries) => {
      footer.style.width = mainContent.clientWidth + 'px';
      footer.style.marginLeft = mainContent.offsetLeft + 'px';
    });

    // iniciar observer de redimensionamento
    resize_ob.observe(mainContent);
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

  onBackToExport(){
    this.gpsBackToExport.emit()
  }

  onLoadFile(event: HttpResponse<any>){
    this.importItems = event.body?.items;
    this.hideLoading();

    this.disableVisualizationButton = this.importItems?.length == 0 || this.importItems[0]?.overRegs;

    if(this.importItems.length == 0){
      this.notificationService.warning("Não foram encontrados registros válidos, verifique o arquivo e tente novamente.");
      this.selectedFile = null;
    }

    if (event.body?.items[0]?.overRegs) {
      this.dialogService.confirm({
        title: 'Pré-visualização indisponível',
        message: 'Devido ao número de registros ser superior a 500, a pré-visualização não será possível. Deseja confirmar a efetivação dos registros sem pré-visualizar?',
        confirm: () => {
          this.showLoading('Salvando...');
          this.service.massExecute(event.body.items,this.gpsUrl,this.gpsHeaders)
          .then(result =>{
            this.notificationService.success(`Movimentação em massa realizada com sucesso, verifique os relatórios de sucesso e complementar na central de documentos.`);
            this.pageNavigation.back();
          }).finally(() =>{
            this.selectedFile = null;
            this.hideLoading();
          })
        },
        cancel: () => {
          this.selectedFile = null;
        }
      });
    }

    this.gpsOnCheckFile.emit(this.importItems);
  }

  onLoadFileError(error){
    this.hideLoading();
  }

  goToChecking(){
    this.gpsGoToCheck.emit();
  }


  beforeLoadFile(event){
    this.showLoading();
  }

}
