import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { GpsMassUpdateService } from '../service/gps-mass-update.service';

@Component({
  selector: 'checking-execute',
  templateUrl: './checking-execute.component.html',
  styleUrls: ['./checking-execute.component.css']
})
export class CheckingExecuteComponent implements OnInit, OnChanges, AfterViewInit {
  
  @Input('gps-url') gpsUrl: string;
  @Input('gps-import-items') gpsImportItems: Array<any>;
  @Input('gps-columns') gpsColumns: Array<PoTableColumn>;
  @Input('gps-child-property-name') gpsChildPropertyName: string;

  @Output('gps-on-check-file') gpsOnCheckFile: EventEmitter<any> = new EventEmitter();
  
  @ViewChild(PoModalComponent, { static: true }) errorModal: PoModalComponent;
  

  loadingMessage: string = "Salvando...";
  isLoading: boolean = false;

  items: Array<any> = [];

  errorItems: Array<any> = [];
  errorColums: Array<PoTableColumn> = [
    {property: 'error_message', label: 'Erro'}
  ];

  columns: Array<PoTableColumn> = [ ];
  contentHeigth: number;
  
  closeAction: PoModalAction = {
    label: 'Fechar',
    action: this.closeErrorModal.bind(this)
  }

  hasChangeSelected: boolean = false;

  updateItemsByRecheck: boolean = false;

  @Output('gps-back-to-load') gpsBackToLoad: EventEmitter<any> = new EventEmitter();

  constructor(
    private service: GpsMassUpdateService,
    private notificationService: PoNotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {    
  }

  ngAfterViewInit(): void {
    let component = document.getElementById('checkingExecuteComponent');
    let mainContent:any = document.getElementsByTagName('po-widget')[0];
    let footer = document.getElementById('checking-execute-footer');    

    this.calculateContentHeigth(component)
    
    //Criação de observer para detectar a mudança de tamanho e recalcular altura da tabela
    const resize_ob = new ResizeObserver((entries) => {
      this.calculateContentHeigth(component);
      
      footer.style.width = mainContent.clientWidth + 'px';   
      footer.style.marginLeft = mainContent.offsetLeft + 'px';
    });
    
    // iniciar observer de redimensionamento
    resize_ob.observe(component);
  }

  calculateContentHeigth(element){
    let heigth = parseInt(getComputedStyle(element).height.split('px')[0])
    if(heigth > 591){
      this.contentHeigth = heigth - 20;
    }
    else{
      this.contentHeigth = heigth - 80;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.gpsImportItems?.currentValue){
      this.items = [];
      this.hasChangeSelected = false;
      this.gpsImportItems.sort((a,b) => a.lineNumber-b.lineNumber);
      //Se a atualização dos items da tabela ocorrer a partir de uma revalidação, não marca como selecionado os que possuem sucesso, apenas desmarca os que houverem erros
      if(this.updateItemsByRecheck){
        this.updateItemsByRecheck = false;

        this.gpsImportItems.forEach(item => {        
          if(this.gpsChildPropertyName){
            item[this.gpsChildPropertyName].sort((a,b) => a.lineNumber-b.lineNumber);
          }
          if(item.status != 'S'){
            item['$selected'] = false;
            if(this.gpsChildPropertyName){
              item[this.gpsChildPropertyName].forEach(child =>{
                child['$selected'] = false;
              })
            }        
            this.setErrorColumnAsVisible();
          }
          this.items.push(item);
        });         
      }
      else{      
        this.gpsImportItems.forEach(item => {        
          item['$selected'] = item.status == 'S';
          if(this.gpsChildPropertyName){
            item[this.gpsChildPropertyName].sort((a,b) => a.lineNumber-b.lineNumber);
            item[this.gpsChildPropertyName].forEach(child =>{
              child['$selected'] = item.status == 'S';
            })
          }        
          if (item.status != 'S'){
            this.setErrorColumnAsVisible();
          }
          this.items.push(item);
        });
      }
    }
    if(changes?.gpsColumns?.currentValue){      

      this.setDefaultColumns();

      this.gpsColumns.forEach(column => {
        if(column.type == 'detail'){
          column.detail.columns.unshift({property: 'action', label: 'Operação'});
          column.detail.columns.unshift({property: 'lineNumber', label: 'Linha' });
          this.columns.unshift(column);
        }
        else{
          this.columns.push(column);
        }
      })

      this.addErrorColumn();
    }
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
  
  onBackToLoad(){
    this.gpsBackToLoad.emit()
  }

  onConfirm(){
    this.showLoading();
    this.service.massExecute(this.items, this.gpsUrl)
    .then(result =>{
      this.notificationService.success(`Importação realizada com sucesso. Arquivo ${result.fileName} com relatório da execução enviado para a Central de documentos.`);
    })
    .finally(() =>{
      this.hideLoading();
    })
  }

  onReCheck(){
    this.showLoading('Revalidando...');
    let selected_items = [];

    this.items.forEach(item =>{
      if(item['$selected']){
        let item_aux = new Object();
        Object.assign(item_aux, item);
        selected_items.push(item_aux);
        if(this.gpsChildPropertyName){
          selected_items[selected_items.length - 1][this.gpsChildPropertyName] = item_aux[this.gpsChildPropertyName].filter(child =>{
                                                            return child['$selected'];
                                                        });
        }
      }
    })

    this.service.massExecuteCheck(selected_items, this.gpsUrl)
    .then(result =>{
      let items_updated = this.items.map(item =>{
        let result_item = result.find(res_item =>{
          return res_item.hashId == item.hashId;
        });

        if(result_item){
          if(result_item.status == 'S'){
            result_item['$selected'] = true;            
          }
          if(this.gpsChildPropertyName){
            result_item[this.gpsChildPropertyName] = item[this.gpsChildPropertyName];
          }        
          item = result_item;
        }
        return item;
      })
      this.gpsOnCheckFile.emit(items_updated);    
      this.updateItemsByRecheck = true;
    })
    .finally(() =>{
      this.hideLoading();
    })
  }

  setDefaultColumns(){  
    this.columns = [            
      {
        label: 'Linha',
        property: 'lineNumber'      
      },
      {
        label: 'Operação',
        property: 'action',
      },
      {
        property: 'status',
        type: 'label',
        labels: [
          { value: 'S', color: 'color-11', label: 'Sucesso' },
          { value: 'W', color: 'color-08', label: 'Atenção' },
          { value: 'E', color: 'color-07', label: 'Erro' }
        ]
      }
    ];
  }

  setErrorColumnAsVisible(){
    this.columns = this.columns.map((item) =>{
      if(item.property == 'error'){
        item.visible = true;
      }
      return item;
    })
  }

  addErrorColumn(){
    this.columns.push({
      property: 'error',
      label: 'Erros',
      type: 'link',
      action: (value, row) => { this.openErrorModal(value) },
      visible:false
    })
  }

  openErrorModal(errorMessage){
    this.errorItems = [];
    this.errorItems = errorMessage.split(';').map(error_message =>{
      return {error_message}
    })
    this.errorModal.open()
  }

  clearErrorMessage(){
    this.errorItems = [];
  }

  closeErrorModal(){
    this.errorModal.close()
  }

  onSelect(item){    
    this.setHasChangeSelected(true);
    item[this.gpsChildPropertyName]?.forEach(child =>{
      child['$selected'] = true;
    })

    //Verificar se é um registro filho para selecionar quando selecionar um filho
    if(this.gpsChildPropertyName && !item.hasOwnProperty(this.gpsChildPropertyName)){
      if(item['$selected']){
        let child = this.items.find(it =>{
          return it.hashId == item.hashId;
        })

        child['$selected'] = true;
      }
    }

  }
  
  onUnselect(item){
    this.setHasChangeSelected(true);
    item[this.gpsChildPropertyName]?.forEach(child =>{
      child['$selected'] = false;
    })
  }

  onSelectAll(items){
    items.forEach(item =>{
      this.onSelect(item);
    })
  }
  
  onUnselectAll(items){
    items.forEach(item =>{
      this.onUnselect(item);
    })
  }

  setHasChangeSelected(value){
    //Se não havia alterações na seleção da tabela mas passou a ter, emite alerta para usuário que ele deverá revalidar os dados.
    if(!this.hasChangeSelected && value){
      this.notificationService.warning('Você alterou a seleção de registros à serem enviados. É necessário que a seleção seja revalidada antes de efetivar.');
    }
    this.hasChangeSelected = value;
  }

}