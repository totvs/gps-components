import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn, PoTableDetail } from '@po-ui/ng-components';
import { GpsPageNavigation } from 'totvs-gps-crud';
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
  
  private pageNavigation:GpsPageNavigation = new GpsPageNavigation();
  

  loadingMessage: string = "Salvando...";
  isLoading: boolean = false;

  items: Array<any> = [];

  errorItems: Array<any> = [];
  errorColums: Array<PoTableColumn> = [
    {property: 'error_message', label: 'Erro'}
  ];

  columns: Array<PoTableColumn> = [ ];
  childColumns: Array<PoTableColumn> = [ ];
  contentHeigth: number;
  
  closeAction: PoModalAction = {
    label: 'Fechar',
    action: this.closeErrorModal.bind(this)
  }

  hasChangeSelected: boolean = false;
  showTable: boolean = true;

  updateItemsByRecheck: boolean = false;

  @Output('gps-back-to-load') gpsBackToLoad: EventEmitter<any> = new EventEmitter();

  constructor(
    private service: GpsMassUpdateService,
    private notificationService: PoNotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { 
    this.pageNavigation.setRouter(router);
  }

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
    this.reloadData(changes);
  }  

  reloadData(changes: SimpleChanges){    
    if(changes?.gpsImportItems?.currentValue){     
      this.showLoading('Carregando...');
      this.showTable = false;
      this.items = [];
      let itemsAux = [];
      this.hasChangeSelected = false;
      this.gpsImportItems.sort((a,b) => a.lineNumber-b.lineNumber);
      //Se a atualização dos items da tabela ocorrer a partir de uma revalidação, não marca como selecionado os que possuem sucesso, apenas desmarca os que houverem erros
      if(this.updateItemsByRecheck){
        this.updateItemsByRecheck = false;

        for (const item of this.gpsImportItems) {
          if(this.gpsChildPropertyName){
            item[this.gpsChildPropertyName].sort((a,b) => a.lineNumber-b.lineNumber);
          }
          if(item.GpsStatus != 'S'){
            item['$selected'] = false;
            if(this.gpsChildPropertyName){
              for (const child of item[this.gpsChildPropertyName]) {
                child['$selected'] = false;
              }
            }        
            this.setErrorColumnAsVisible();
          }
          itemsAux.push(item);
        }
      }
      else{      
        for (const item of this.gpsImportItems) {
          item['$selected'] = item.GpsStatus == 'S';
          if(this.gpsChildPropertyName){
            item[this.gpsChildPropertyName].sort((a,b) => a.lineNumber-b.lineNumber);
            for (const child of item[this.gpsChildPropertyName]) {
              child['$selected'] = item.GpsStatus == 'S';
            }
          }        
          if (item.GpsStatus != 'S'){
            this.setErrorColumnAsVisible();
          }
          itemsAux.push(item);
        }
      }
      this.items = itemsAux;
      //Timeout utilizado para garantir atualização da tabela com os items, incluido pois ocasionalmente a tabela concatenava os registros de 2 importações
      setTimeout(() => {
        this.showTable = true;
        this.hideLoading();
      }, 10);
      
    }
    if(changes?.gpsColumns?.currentValue){      

      this.setDefaultColumns();

      this.gpsColumns.forEach(column => {
        if(column.type == 'detail'){
          column.detail.columns.unshift({property: 'action', label: 'Operação' });
          column.detail.columns.unshift({property: 'lineNumber', label: 'Linha' });
          this.columns.unshift(column);
          this.childColumns = [...column.detail.columns];
          this.childColumns.map(childColumn =>{
            childColumn.color = this.setChildColumnColor.bind(this);
          })
        }
        else{
          this.columns.push(column);
        }
      })

      this.addErrorColumn();
    }
  }
  setChildColumnColor(item){
    console.log(item);
    if(item.action == 'EXCLUIR' && item.oldAction == 'ALTERAR'){
      return 'color-07';
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
    this.showLoading('Salvando...');
    this.service.massExecute(this.items, this.gpsUrl)
    .then(result =>{
      this.notificationService.success(`Movimentação em massa realizada com sucesso, verifique os relatórios de sucesso e complementar na central de documentos.`);
      this.pageNavigation.back();
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
          if(result_item.GpsStatus == 'S'){
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
        property: 'GpsStatus',
        label:'Status',
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

  adjustActionOnSelect(item){
    if(item.hasOwnProperty(this.gpsChildPropertyName)){
      return;
    }
    if(item.action == "EXCLUIR" && item.oldAction){
      item.action = item.oldAction;
      item.oldAction = null;
    }
  }

  adjustActionOnUnselect(item, unselectByMaster = false){
    if(item.hasOwnProperty(this.gpsChildPropertyName) || unselectByMaster){
      return;
    }
    if(item.action == "ALTERAR"){
      item.oldAction = "ALTERAR";
      item.action = "EXCLUIR";
    }
  }

  onSelect(item){    
    this.adjustActionOnSelect(item);

    this.setHasChangeSelected(true);
    item[this.gpsChildPropertyName]?.forEach(child =>{
      child['$selected'] = true;
      this.onSelect(child);
    })

    //Verificar se é um registro filho para selecionar o pai quando selecionar um de se seus filhos
    if(this.gpsChildPropertyName && !item.hasOwnProperty(this.gpsChildPropertyName)){
      if(item['$selected']){
        let child = this.items.find(it =>{
          return it.hashId == item.hashId;
        })

        child['$selected'] = true;
      }
    }

  }
  
  onUnselect(item,unselectByMaster = false){
    this.adjustActionOnUnselect(item, unselectByMaster);
    if(this.gpsChildPropertyName && !item.hasOwnProperty(this.gpsChildPropertyName) && !unselectByMaster && item.oldAction == 'ALTERAR'){
      this.notificationService.error('Você desmarcou um registro vinculado a um registro principal. Caso esse registro já exista na base de dedos, ele será excluído.');
    }
    
    this.setHasChangeSelected(true);
    item[this.gpsChildPropertyName]?.forEach(child =>{
      child['$selected'] = false;
      this.onUnselect(child, true);
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

  showTableDetail(rowItem:any, index:any){
    return rowItem[this.gpsChildPropertyName]?.length > 0;
  }

}