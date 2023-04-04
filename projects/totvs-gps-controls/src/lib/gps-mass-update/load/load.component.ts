import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PoNotificationService, PoUploadFileRestrictions } from '@po-ui/ng-components';
import { GpsMassUpdateService } from '../service/gps-mass-update.service';

@Component({
  selector: 'load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit, AfterViewInit {

  @Input('gps-url') gpsUrl: string;

  loadingMessage: string = "Enviando arquivo...";
  isLoading: boolean = false;

  @Input('gps-selected-file') selectedFile: Array<any> = [];
  importItems:Array<any> = [];

  @Output('gps-back-to-export') gpsBackToExport: EventEmitter<any> = new EventEmitter();
  @Output('gps-on-check-file') gpsOnCheckFile: EventEmitter<any> = new EventEmitter();
  @Output('gps-go-to-check') gpsGoToCheck: EventEmitter<any> = new EventEmitter();

  uploadUrl: string;
  uploadRestrictions: PoUploadFileRestrictions = {
    allowedExtensions: ['.csv'],
    maxFiles: 1
  }

  constructor(
    private service: GpsMassUpdateService,
    private notificationService: PoNotificationService
  ) { }

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
    if(this.importItems.length == 0){
      this.notificationService.warning("Não foram encontrados registros válidos, verifique o arquivo e tente novamente.");
      this.selectedFile = null;
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
