import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PoBreadcrumb, PoStepperComponent, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'gps-mass-update',
  templateUrl: './gps-mass-update.component.html',
  styleUrls: ['./gps-mass-update.component.css']
})
export class GpsMassUpdateComponent implements OnInit, AfterViewInit {
  @Input('gps-url') gpsUrl: string;  
  @Input('gps-headers') gpsHeaders: Object; //Objeto simples {chave:valor}
  
  @Input('gps-main-page-label') gpsMainPageLabel: string = '';  
  @Input('gps-columns') gpsColumns: Array<PoTableColumn>;
  @Input('gps-items') gpsItems: Array<PoTableColumn>;
  
  @Input('gps-child-property-name') gpsChildPropertyName: string;

  @Input('filter')
    get parameterGpsFilter() { return this._parameterGpsFilter }
    set parameterGpsFilter(value) { this._parameterGpsFilter = value; }
  @Output('filterChange') onGpsFilterChange: EventEmitter<any> = new EventEmitter();
  @Output('gps-format-items') gpsFormatItems: EventEmitter<any> = new EventEmitter();

  _parameterGpsFilter;

  importItems:Array<any>;
  selectedFile: Array<any> = [];
  gpsHeadersModified: Object = {};

  breadcrumb: PoBreadcrumb = {
    items: []
  }

  constructor(private changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setbreadcrumbItems();
  }
  
  ngAfterViewInit(){  
    //O componente po-upload (propriedade p-headers) espera somente um objeto simples ({chave:valor})
    //Já para funcionar nas demais requisições ao backend precisamos alterar o gpsHeaders conforme código a seguir
    for (const key in this.gpsHeaders) {
      this.gpsHeadersModified = {
        headers: new HttpHeaders().set(key,this.gpsHeaders[key])
      }
    }    
    
    let stepper:any = document.getElementsByClassName('po-stepper-horizontal')[0];
    let stepperWidth = stepper.clientWidth + 'px';

    /* Código para aplicar classe sterpper-fixed no stepper ao rolar da tela */ 
    let element:any = document.getElementsByClassName("po-page-content")[0]

    let adjustheader = function() {      
      // Get the header
      var header:any = document.getElementsByClassName("po-stepper-container")[0];
      
      if (!header) {
        return;
      }

      // Get the offset position of the navbar
      var sticky = header.offsetTop;
      if (document.getElementsByClassName("po-page-content")[0].scrollTop > sticky) {
          header.classList.add("stepper-fixed");
      } else {
          header.classList.remove("stepper-fixed");
      }
      header.style.width = stepperWidth;
    };
    
    element.onscroll = adjustheader;

    /* Código para ajustar largura do stepper ao redimencionar a tela */
    //Criação de observer para detectar a mudança de tamanho e recalcular largura do stepper
    const resize_ob = new ResizeObserver((entries) => {
      stepper = document.getElementsByClassName('po-stepper-horizontal')[0];
      stepperWidth = stepper?.clientWidth + 'px';
      adjustheader();
    });
    
    // iniciar observer de redimensionamento
    resize_ob.observe(element);


    this.changeDetectorRef.detectChanges();
  }

  onPassExport(stepperComponent: PoStepperComponent){
    stepperComponent.next();
  }
  
  onBackToExport(stepperComponent: PoStepperComponent){
    stepperComponent.previous();
  }

  onBackToLoad(stepperComponent: PoStepperComponent){
    stepperComponent.previous();
  }

  setbreadcrumbItems(){
    this.breadcrumb.items = [      
      { 
        label: this.gpsMainPageLabel,
        link: '/'
      },
      { 
        label: 'Atualização em massa',
        link: '/massUpdate'
      }
    ];
  }

  onCheckFile(result, stepperComponent:PoStepperComponent){
    this.importItems = result; 
    if(this.gpsFormatItems){
      this.gpsFormatItems.emit(this.importItems)
    }
    else{
      this.gpsItems = this.importItems;
    }
  }

  goToCheck(stepperComponent:PoStepperComponent){
    stepperComponent.next();
  }

  canNextStep(){
    return this.gpsItems?.length > 0;
  }

  changeStep(step){
    this.selectedFile = new Array();
  }

}
