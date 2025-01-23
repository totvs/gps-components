import { Component, Input, ChangeDetectorRef, ViewChild, ContentChild, Output, EventEmitter } from "@angular/core";
import { PoPageFilter, PoDisclaimer, PoDisclaimerGroup, PoModalComponent, PoDisclaimerGroupRemoveAction, PoButtonComponent } from "@po-ui/ng-components";
import { isNull } from "totvs-gps-utils";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { TotvsGpsDateUtils } from "totvs-gps-utils";
import { GpsAdvancedSearchDirective } from "../directives/gps-advanced-search.directive";
import { ILoadingData } from "../gps-page.internal-model";
import { IDisclaimerConfig } from "../models/gps-page.model";
import { TotvsStringUtils } from "totvs-gps-utils";

@Component({
    selector: 'gps-page-list',
    templateUrl: './gps-page-list.component.html',
})
export class GpsPageListComponent extends GpsPageBaseComponent {

    @ContentChild(GpsAdvancedSearchDirective, { static: true }) advancedSearchTemplateRef: GpsAdvancedSearchDirective;
    @ViewChild('advancedSearchModal', { static: false }) advancedSearchModal: PoModalComponent;
    @ViewChild('buttonSubmitAdvancedFilter', {static: false}) buttonSubmitAdvancedFilter: PoButtonComponent;
    @ViewChild('buttonCancelAdvancedFilter', {static: false}) buttonCancelAdvancedFilter: PoButtonComponent;
    @ViewChild('buttonClearFieldsAdvancedFilter', {static: false}) buttonClearFieldsAdvancedFilter: PoButtonComponent;

    //#region Common properties
    @Input('p-title') parameterTitle: string;
    @Input('p-custom-fields-class') customFieldsClass: string = '';
    //#endregion    

    //#region Portinari properties
    @Input('p-breadcrumb') parameterBreadcrumb;
    @Input('p-disclaimer-group') parameterDisclaimerGroup;
    @Input('p-literals') parameterLiterals;
    @Input('p-actions') parameterActions;
    //#endregion

    //#region specific properties
    @Input('filter')
        get parameterGpsFilter() { return this._parameterGpsFilter }
        set parameterGpsFilter(value) { this._parameterGpsFilter = value; this.updateFilterAction(); this.refreshDisclaimers() }
    @Output('filterChange') onGpsFilterChange: EventEmitter<any> = new EventEmitter();
    @Input('disclaimer-config')
        get parameterGpsDisclaimerConfig() { return this._parameterGpsDisclaimerConfig }
        set parameterGpsDisclaimerConfig(value) { this._parameterGpsDisclaimerConfig = value; this.refreshDisclaimers() }
    @Input('disable-advanced-search') 
        get parameterDisableAdvancedSearch() { return this._parameterDisableAdvancedSearch }
        set parameterDisableAdvancedSearch(value:any) { this.setParameterDisableAdvancedSearch(value) }
    @Input('loading-advanced-search') 
        get parameterLoadingAdvancedSearch() { return this._parameterLoadingAdvancedSearch }
        set parameterLoadingAdvancedSearch(value:any) { this.setParameterLoadingAdvancedSearch(value) }
    @Input('showButtonClearFields')
        get showButtonClearFields() { return this._showButtonClearFields }
        set showButtonClearFields(value:any) {this.setParametersShowButtonClearFields(value) }

    @Output('on-search') onSearch: EventEmitter<any> = new EventEmitter();
    @Output('before-advanced-search') beforeAdvancedSearch: EventEmitter<any> = new EventEmitter();
    @Output('on-advanced-search') onAdvancedSearch: EventEmitter<any> = new EventEmitter();
    //#endregion

    //#region startup
    constructor(private _changeDetectorRef: ChangeDetectorRef) {
        super();        
    }

    private totvsStringUtils = TotvsStringUtils.getInstance();
    //#endregion

    //#region loading
    public loadingStatus: ILoadingData = { active: false, message: '' };
    public showLoading(message?: string) {
        this.loadingStatus.message = (message || '');
        this.loadingStatus.active = true;
    }
    public hideLoading() {
        this.loadingStatus.active = false;
        this.loadingStatus.message = '';
    }
    //#endregion

    //#region filter parameter
    private _internalFilter: PoPageFilter = {
        placeholder: 'Pesquisar',
        width: null,
        action: (filter) => {
            this.onSearch.emit(filter);
            this.refreshDisclaimers();
        }
    };

    get internalFilter() {
        return this._internalFilter;
    }

    set setInternalFilter(internalFilter:PoPageFilter){
        this._internalFilter = internalFilter;
    }

    private updateFilterAction() {
        if (this.onSearch.observers.length > 0)
            this.setGpsFilter();
        else 
            this._internalFilter = null;
    }

    private setGpsFilter() {
        this._internalFilter = {
            placeholder: this._internalFilter.placeholder || 'Pesquisar',
            width: this._internalFilter.width || null,
            action: (filter) => {
                this.onSearch.emit(filter);
                this.refreshDisclaimers();
            }
        }
        if (this.hasAdvancedSearch)
            this._internalFilter.advancedAction = () => { this.openAdvancedSearch(); }
        this._changeDetectorRef.detectChanges();
    }
    //#endregion

    //#region disclaimers
    private _defaultDisclaimerGroup: PoDisclaimerGroup = { disclaimers: [], title: 'Apresentando resultados filtrados por:', hideRemoveAll: false, removeAll: ((disclaimers:Array<PoDisclaimer>) => this.removeAllDisclaimers(disclaimers)), remove: ((disclaimer) => this.removeDisclaimer(disclaimer)) };
    private _parameterGpsDisclaimerConfig: IDisclaimerConfig[];
    private _disclaimersVisible: boolean = true;

    get internalDisclaimerGroup() {
        if (!this._disclaimersVisible)
            return null;
        if (isNull(this.parameterDisclaimerGroup))
            return this._defaultDisclaimerGroup;
        return this.parameterDisclaimerGroup;
    }

    refreshDisclaimers() {
        if(this._isClearFields) 
            return;
            
        if (isNull(this._parameterGpsFilter) || isNull(this._parameterGpsDisclaimerConfig))
            this._defaultDisclaimerGroup.disclaimers = [];
        else
            this._defaultDisclaimerGroup.disclaimers = this.parseDisclaimers(this._parameterGpsFilter, this._parameterGpsDisclaimerConfig);
    }

    hideDisclaimers() {
        this._disclaimersVisible = false;
    }

    showDisclaimers() {
        this._disclaimersVisible = true;
        this.refreshDisclaimers();
    }

    removeAllDisclaimers(disclaimers:Array<PoDisclaimer>){
        this._parameterGpsFilter = {};
        this.refreshDisclaimers();
        this.onGpsFilterChange.emit(this._parameterGpsFilter);
        this.onAdvancedSearch.emit(null);
    }

    removeDisclaimer(disclaimer:PoDisclaimerGroupRemoveAction) {
        //Caso houver grupos busca os campos referente ao grupo removido
        const disclaimersConfigRemove = this._parameterGpsDisclaimerConfig.filter((disc) => disc.group == disclaimer.removedDisclaimer.property);
        
        //Remove conforme grupo de disclaimer removido
        if(Array.isArray(disclaimersConfigRemove) && disclaimersConfigRemove.length > 0){
            disclaimersConfigRemove.forEach((item) => {
                delete this._parameterGpsFilter[item.property];
            })
        } else {
            //Remove caso nao tenha grupo ou caso o grupo seja igual ao property
            delete this._parameterGpsFilter[disclaimer.removedDisclaimer.property];
        }

        if(disclaimer.currentDisclaimers.length == 0){
            this.removeAllDisclaimers(disclaimer.currentDisclaimers);
            return;
        }
        this.onAdvancedSearch.emit(this._parameterGpsFilter);
    }

    private parseDisclaimers(obj, config: IDisclaimerConfig[]): PoDisclaimer[] {
        let disclaimers: PoDisclaimer[] = [];
        config.forEach(param => {
            if (!isNull(obj[param.property])||(param.type === 'function')) {
                let value = '';
                if (param.type === 'date')
                    value = TotvsGpsDateUtils.getInstance().getLocaleDate(obj[param.property])
                else if (param.type === 'boolean')
                    value = (obj[param.property] ? 'Sim' : 'Não')
                else if (param.type === 'true') {
                    if (!obj[param.property])
                        return;
                    value = 'true';
                }
                else if (param.type === 'function') {
                    if (!isNull(param.value))
                        value = param.value(obj);
                    else
                        value = '';
                }
                else
                    value = String(obj[param.property]).valueOf();
                if ((value === '')&&(isNull(value)))
                    return;
                if ((param.type != 'function')&&(!isNull(param.value)))
                    value = param.value(value);
                let item: PoDisclaimer = disclaimers.find(item => item.property == (param.group || param.property || param.label));
                if (isNull(item)) {
                    item = { property: (param.group || param.property || param.label), hideClose: (param.hideClose === false ? param.hideClose : true), value: value };
                    disclaimers.push(item);
                }
                else
                    item.value += (param.separator || '') + value;
                if (param.type === 'true')
                    item.label = param.label;
                else
                    item.label = `${param.label}: ${item.value}`;
            }
        });
        return disclaimers;
    }

    //#endregion

    //#region advanced search
    private _parameterGpsFilter;
    private _parameterDisableAdvancedSearch: boolean;
    private _parameterLoadingAdvancedSearch: boolean;
    private _showButtonClearFields: boolean;
    private _isClearFields: boolean = false;
    private oldParametersGpsFilter;

    private setParameterDisableAdvancedSearch(value:any) {
        const v = this.totvsStringUtils.toBoolean(value);
        if (v !== this._parameterDisableAdvancedSearch) {
            this._parameterDisableAdvancedSearch = v;
            this.buttonSubmitAdvancedFilter.disabled = this._parameterDisableAdvancedSearch;
        }
    }
    private setParameterLoadingAdvancedSearch(value:any) {
        const v = this.totvsStringUtils.toBoolean(value);
        if (v !== this._parameterLoadingAdvancedSearch) {
            this._parameterLoadingAdvancedSearch = v;
            this.buttonSubmitAdvancedFilter.loading = this._parameterLoadingAdvancedSearch;
        }
    }

    private setParametersShowButtonClearFields(value:any){
        const v = this.totvsStringUtils.toBoolean(value);
        if(v !== this._showButtonClearFields) {
            this._showButtonClearFields = v;
        }
    }

    get hasAdvancedSearch(): boolean {
        return !isNull(this.advancedSearchTemplateRef);
    }

    openAdvancedSearch() {
        let _oldValue = Object.assign({}, this._parameterGpsFilter);

        let _fncRollback = () => {
            if(!this._isClearFields){
                this._parameterGpsFilter = _oldValue;
                this.onGpsFilterChange.emit(this._parameterGpsFilter);
            }
        };

        this.beforeAdvancedSearch.emit();

        this.openAdvancedSearchModal()
            .then(value => {
                
                // Aplicar filtros
                if (value && value !== 'clear') {

                    this._isClearFields = false;

                    this._parameterGpsFilter = value;
                    this.onGpsFilterChange.emit(this._parameterGpsFilter);
                    this.onAdvancedSearch.emit(this._parameterGpsFilter);
                    this.refreshDisclaimers();
                }
                // Limpar campos
                else if(value === 'clear'){

                    this._isClearFields = true;
                    
                    if(this.oldParametersGpsFilter 
                    && this.parameterGpsDisclaimerConfig){
                        Object.assign(this.oldParametersGpsFilter, this._parameterGpsFilter);
                    }

                    this._parameterGpsFilter = {}
                    this.onGpsFilterChange.emit(this._parameterGpsFilter);
                    this.advancedSearchModal.close();

                    this.openAdvancedSearch();

                }
                else
                    _fncRollback();
            })
            .catch(() => _fncRollback());
    }

    private openAdvancedSearchModal(): Promise<any> {
        let _modal = this.advancedSearchModal;
        let _searchButton = this.buttonSubmitAdvancedFilter;
        let _closeButton = this.buttonCancelAdvancedFilter;
        let _clearButton = this.buttonClearFieldsAdvancedFilter;
        let _filter = this._parameterGpsFilter;

        return new Promise(resolve => {

            _searchButton.onClick = () => {
                this.oldParametersGpsFilter = {};
                _modal.close();
                resolve(_filter);
            }

            _closeButton.onClick = () => {
                if(!isNull(this.oldParametersGpsFilter)){
                    if(Object.keys(this.oldParametersGpsFilter).length > 0){
                        Object.assign(this._parameterGpsFilter, this.oldParametersGpsFilter);
                        this.onGpsFilterChange.emit(this._parameterGpsFilter);
                    }
                }
                
                this.oldParametersGpsFilter = {};

                _modal.close();
                resolve(null);
            }

            if(_clearButton !== undefined){
                _clearButton.onClick = () => {
                    resolve('clear');
                }
            }

            _modal.open();
        });
    }

    advancedSearchKeyPress(event) {
        if (event.keyCode == 13) 
            this.submitAdvancedSearchForm();
    }

    private submitAdvancedSearchForm() {
        if (this.hasAdvancedSearch)
            this.buttonSubmitAdvancedFilter.onClick.call(this)
    }
    //#endregion
}