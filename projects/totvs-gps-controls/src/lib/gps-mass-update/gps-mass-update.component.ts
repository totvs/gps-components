import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PoBreadcrumb, PoStepperComponent, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'gps-mass-update',
  templateUrl: './gps-mass-update.component.html',
  styleUrls: ['./gps-mass-update.component.css']
})
export class GpsMassUpdateComponent implements OnInit, AfterViewInit {
  @Input('gps-url') gpsUrl: string;  

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

  breadcrumb: PoBreadcrumb = {
    items: []
  }

  constructor() { }

  ngOnInit(): void {
    this.setbreadcrumbItems()
  }
  
  ngAfterViewInit(){   
    let stepper:any = document.getElementsByClassName('po-stepper-horizontal')[0];
    let stepperWidth = stepper.clientWidth + 'px';

    /* Código para aplicar classe sterpper-fixed no stepper ao rolar da tela */ 
    let element:any = document.getElementsByClassName("po-page-content")[0]

    let adjustheader = function() {      
      // Get the header
      var header:any = document.getElementsByClassName("po-stepper-container")[0];
      
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
      stepperWidth = stepper.clientWidth + 'px';
      adjustheader();
    });
    
    // iniciar observer de redimensionamento
    resize_ob.observe(element);

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
  }

  goToCheck(stepperComponent:PoStepperComponent){
    stepperComponent.next();
  }

  canNextStep(){
    return this.gpsItems?.length > 0;
  }

}
