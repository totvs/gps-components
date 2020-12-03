import { Component, Input, ChangeDetectorRef, ViewChild, ContentChild, Output, EventEmitter } from "@angular/core";
import { PoPageFilter, PoDisclaimer, PoDisclaimerGroup, PoModalComponent, PoModalAction } from "@po-ui/ng-components";
import { isNullOrUndefined } from "util";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { TotvsGpsDateUtils } from "totvs-gps-utils";
import { GpsAdvancedSearchDirective } from "../directives/gps-advanced-search.directive";
import { ILoadingData } from "../gps-page.internal-model";
import { IDisclaimerConfig } from "../models/gps-page.model";

@Component({
    selector: 'gps-page-list',
    templateUrl: './gps-page-list.component.html',
})
export class GpsPageListComponent extends GpsPageBaseComponent {

    @ContentChild(GpsAdvancedSearchDirective, { static: true }) advancedSearchTemplateRef: GpsAdvancedSearchDirective;
    @ViewChild('advancedSearchModal', { static: false }) advancedSearchModal: PoModalComponent;

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

    @Output('on-search') onSearch: EventEmitter<any> = new EventEmitter();
    @Output('before-advanced-search') beforeAdvancedSearch: EventEmitter<any> = new EventEmitter();
    @Output('on-advanced-search') onAdvancedSearch: EventEmitter<any> = new EventEmitter();
    //#endregion

    //#region startup
    constructor(
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

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
    private _internalFilter: PoPageFilter;
    get internalFilter() {
        return this._internalFilter;
    }

    private updateFilterAction() {
        if (this.onSearch.observers.length > 0)
            this.setGpsFilter();
        else 
            this._internalFilter = null;
    }

    private setGpsFilter() {
        this._internalFilter = {
            placeholder: 'Pesquisar',
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
    private _defaultDisclaimerGroup: PoDisclaimerGroup = { disclaimers: [], title: 'Apresentando resultados filtrados por:', hideRemoveAll: true };
    private _parameterGpsDisclaimerConfig: IDisclaimerConfig[];
    private _disclaimersVisible: boolean = true;

    get internalDisclaimerGroup() {
        if (!this._disclaimersVisible)
            return null;
        if (isNullOrUndefined(this.parameterDisclaimerGroup))
            return this._defaultDisclaimerGroup;
        return this.parameterDisclaimerGroup;
    }

    refreshDisclaimers() {
        if (isNullOrUndefined(this._parameterGpsFilter) || isNullOrUndefined(this._parameterGpsDisclaimerConfig))
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

    private parseDisclaimers(obj, config: IDisclaimerConfig[]): PoDisclaimer[] {
        let disclaimers: PoDisclaimer[] = [];
        config.forEach(param => {
            if (!isNullOrUndefined(obj[param.property])||(param.type === 'function')) {
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
                    if (!isNullOrUndefined(param.value))
                        value = param.value(obj);
                    else
                        value = '';
                }
                else
                    value = String(obj[param.property]).valueOf();
                if ((value === '')&&(isNullOrUndefined(value)))
                    return;
                if ((param.type != 'function')&&(!isNullOrUndefined(param.value)))
                    value = param.value(value);
                let item: PoDisclaimer = disclaimers.find(item => item.property == (param.group || param.property || param.label));
                if (isNullOrUndefined(item)) {
                    item = { property: (param.group || param.property || param.label), hideClose: true, value: value };
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

    get hasAdvancedSearch(): boolean {
        return !isNullOrUndefined(this.advancedSearchTemplateRef);
    }

    modalSearchAction: PoModalAction = { label: 'Aplicar filtros', action: null };
    modalSearchCloseAction: PoModalAction = { label: 'Cancelar', action: null };
    openAdvancedSearch() {
        let _oldValue = Object.assign({}, this._parameterGpsFilter);
        let _fncRollback = () => {
            this._parameterGpsFilter = _oldValue;
            this.onGpsFilterChange.emit(this._parameterGpsFilter);
        };
        this.beforeAdvancedSearch.emit();
        this.openAdvancedSearchModal()
            .then(model => {
                if (model) {
                    this._parameterGpsFilter = model;
                    this.onGpsFilterChange.emit(this._parameterGpsFilter);
                    this.onAdvancedSearch.emit(this._parameterGpsFilter);
                    this.refreshDisclaimers();
                }
                else
                    _fncRollback();
            })
            .catch(() => _fncRollback());
    }

    private openAdvancedSearchModal(): Promise<any> {
        let _modal = this.advancedSearchModal;
        let _searchAction = this.modalSearchAction;
        let _closeAction = this.modalSearchCloseAction;
        let _filter = this._parameterGpsFilter;
        return new Promise(resolve => {
            _searchAction.action = () => {
                _modal.close();
                resolve(_filter);
            };
            _closeAction.action = () => {
                _modal.close();
                resolve(null);
            };
            _modal.open();
        });
    }

    advancedSearchKeyPress(event) {
        if (event.keyCode == 13) 
            this.submitAdvancedSearchForm();
    }

    private submitAdvancedSearchForm() {
        if (this.hasAdvancedSearch)
            this.modalSearchAction.action.call(this);
    }
    //#endregion
}