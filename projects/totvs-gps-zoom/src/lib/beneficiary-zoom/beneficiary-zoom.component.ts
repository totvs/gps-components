import { Component, Input, Output, ViewChild, EventEmitter } from "@angular/core";
import { isNull } from "totvs-gps-utils";
import { PoModalComponent, PoNotificationService, PoModalAction, PoTableColumn } from "@po-ui/ng-components";
import { TotvsGpsCacheService } from "totvs-gps-services";
import { TotvsMaskString } from "totvs-gps-utils";
import { KinshipDegreeService, KinshipDegree } from "totvs-gps-api";
import { BeneficiaryService, Beneficiary, BeneficiaryFilter } from "totvs-gps-api-v2";
import { BeneficiaryZoomModel } from "./beneficiary-zoom.model";
import { toBoolean } from "../../utils/convert.utils";

@Component({
    selector: 'beneficiary-zoom',
    templateUrl: './beneficiary-zoom.component.html',
    providers: [TotvsGpsCacheService, BeneficiaryService, KinshipDegreeService],
    standalone: false
})
export class BeneficiaryZoomComponent {
  private _title = 'Pesquisa de Beneficiários';
  private _multiple = false;
  private _customFilter:any;
  private _customContent = false;

  //#region Component parameters
  @Input('title') 
    set title(value) { this._title = value }
    get title() { return this._title }
  @Input('multiple')
    set multiple(value) { this._multiple = toBoolean(value) }
    get multiple() { return this._multiple }
  @Input('customFilter') 
    set customFilter(value) { this._customFilter = value }
    get customFilter() { return this._customFilter }
  @Input('customContent')
    set customContent(value) { this._customContent = toBoolean(value) }
    get customContent() { return this._customContent }

  @Output('onSelect') onSelect: EventEmitter<Beneficiary | Beneficiary[]> = new EventEmitter();
  @Output('onDefaultFilter') onDefaultFilter: EventEmitter<BeneficiaryFilter> = new EventEmitter();
  //#endregion

  //#region Content ref
  @ViewChild('modalSearch', {static: false}) private modalSearch:PoModalComponent;
  //#endregion

  //#region Component properties
  filter:BeneficiaryFilter;
  listItems:BeneficiaryZoomModel[];
  listIsLoading:boolean = false;
  listHasNext:boolean = false;
  listPage:number = 1;

  modalPrimaryAction:PoModalAction = { label: 'Selecionar', action: this.selectBeneficiary.bind(this) };
  modalSecondaryAction:PoModalAction = { label: 'Cancelar', action: this.closeModal.bind(this) };

  tableColumns:PoTableColumn[] = [
    { property: 'modality', label: 'Modalidade', visible: false },
    { property: 'proposal', label: 'Proposta', visible: false },
    { property: 'contract', label: 'Contrato.', visible: false },
    { property: 'code', label: 'Cód.', width: '4em' },
    { property: '$taxpayerRegistry', label: 'CPF', width: '9em' },
    { property: 'name', label: 'Nome' },
    { property: 'birthDate', label: 'Nascimento', type:'date', width: '8em' },
    { property: 'exclusionDate', type:'date', label: 'Dt.Exclusão', width: '8em' },    
    { property: '$kinshipDegreeDescription', label: 'Grau de Parentesco', visible: false }
  ];

  get hasCustomFilter() {
    return (!isNull(this.customFilter));
  }

  get hasCustomContent() {
    return !!this.customContent;
  }
  //#endregion

  constructor (
    private service:BeneficiaryService,
    private notificationService:PoNotificationService,
    private kinshipDegreeService:KinshipDegreeService,
    private cacheService:TotvsGpsCacheService
  ) {
    this.cacheService.addService(new KinshipDegree(), this.kinshipDegreeService);
  }

  //#region Internal methods
  private clearData() {
    this.filter = {};
    if (this.onDefaultFilter.observers.length > 0)
      this.onDefaultFilter.emit(this.filter);
    this.listItems = [];
    this.listIsLoading = false;
    this.listPage = 1;
    this.listHasNext = false;
  }

  private resetSearch() {
    this.listPage = 1;
    this.listHasNext = false;
    this.listItems = [];
  }

  private search(){
    let filter = (this.customFilter || this.filter);
    this.listIsLoading = true;    
    this.service.getByFilter(filter, this.listPage)
      .then(result => {
        this.listHasNext = result.hasNext;
        this.listIsLoading = false;
        this.listItems = [...this.listItems,...result.items.map(item => this.mapBeneficiary(item))];
      })
      .catch(() => {this.listIsLoading = false});
  }

  private mapBeneficiary(item: Beneficiary): BeneficiaryZoomModel {
    let result = new BeneficiaryZoomModel();
    Object.assign(result, item);
    if (!isNull(result.taxpayerRegistry))
      result.$taxpayerRegistry = TotvsMaskString.getInstance('000.000.000-00').apply(result.taxpayerRegistry);
    result.$kinshipDegree = this.cacheService.get(new KinshipDegree().parseJsonToObject({code: result.kinshipDegree}));        
    return result;
  }  

  private getSelected(): Beneficiary | Beneficiary[] {
    let selected = this.listItems.filter((item) => item['$selected'] === true);
    if (this.multiple)
      return selected.length > 0 ? selected : null;
    if (selected.length > 0)
      return selected[0];
    return;
  }

  private selectBeneficiary() {
    let selected = this.getSelected();

    if (isNull(selected)&&(!this.customContent)) {
      this.notificationService.error('Nenhum beneficiário selecionado!');
    }
    else {
      this.onSelect.emit(selected);
      this.closeModal();
    }
  }

  private closeModal() {
    this.modalSearch.close();
    this.listItems = [];
  }
  //#endregion

  //#region Events
  onKeyUp(event){
    if(event.keyCode == 13){
      window.event.cancelBubble = true; // IE
      event.stopPropagation(); // Modern Browsers
      this.onSearch();
    }
  }

  onListShowMore() {
    this.listPage++;
    this.search();
  }

  onSearch() {
    this.resetSearch()
    this.search();
  }
  //#endregion

  //#region Published properties
  open() {
    this.clearData();    
    this.modalSearch.open();
  }

  reset() {
    this.clearData();
  }
  //#endregion

}