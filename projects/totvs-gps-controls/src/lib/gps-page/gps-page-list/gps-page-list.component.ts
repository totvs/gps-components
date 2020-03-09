import { Component, Input, ViewContainerRef, ChangeDetectorRef, ViewChild, ContentChild, Output, EventEmitter } from "@angular/core";
import { PoPageFilter, PoDisclaimer, PoDisclaimerGroup, PoModalComponent, PoModalAction } from "@portinari/portinari-ui";
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
    @Input('p-filter')
        get parameterFilter(): PoPageFilter { return this._parameterFilter }
        set parameterFilter(value) { this._parameterFilter = value; this.updateFilterAction() };
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
        private _viewContainerRef: ViewContainerRef,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        super();
        this._parentContext = this._viewContainerRef['_view']['component'];
    }

    private _parentContext: ViewContainerRef;
    protected get parentContext(): ViewContainerRef {
        return this._parentContext;
    }
    protected set parentContext(value) {
        this._parentContext = value;
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

    //#region filter model
    private _filterModel: string;
    get filterModel() {
        return this._filterModel;
    }
    set filterModel(value) {
        this._filterModel = value;
        if (!isNullOrUndefined(this._parameterFilter) && !isNullOrUndefined(this._parameterFilter.ngModel) && (this._parameterFilter.ngModel != ''))
            this.parentContext[this._parameterFilter.ngModel] = value;
    }
    //#endregion

    //#region filter parameter
    private _parameterFilter: PoPageFilter;
    private _internalFilter: PoPageFilter;
    get internalFilter() {
        return this._internalFilter;
    }

    private updateFilterAction() {
        if (!isNullOrUndefined(this._parameterFilter))
            this.setPortinariFilter();
        else if (this.onSearch.observers.length > 0)
            this.setGpsFilter();
        else 
            this._internalFilter = null;
    }

    private setPortinariFilter() {
        this._internalFilter = {
            advancedAction: this._parameterFilter.advancedAction,
            ngModel: 'filterModel',
            placeholder: this._parameterFilter.placeholder
        }
        if (this._parameterFilter.action instanceof Function) {
            let _f: Function = this._parameterFilter.action;
            this._internalFilter.action = () => {
                _f();
            };
        }
        else {
            this._internalFilter.action = this._parameterFilter.action;
            this[this._internalFilter.action] = this.parentContext[this._internalFilter.action];
        }
        if (this._parameterFilter.advancedAction instanceof Function) {
            let _f: Function = this._parameterFilter.advancedAction;
            this._internalFilter.advancedAction = () => {
                _f();
            };
        }
        else {
            this._internalFilter.advancedAction = this._parameterFilter.advancedAction;
            this[this._internalFilter.advancedAction] = this.parentContext[this._internalFilter.advancedAction];
        }
        this._changeDetectorRef.detectChanges();
    }

    private setGpsFilter() {
        this._internalFilter = {
            ngModel: 'filterModel',
            placeholder: 'Pesquisar',
            action: () => {
                this.onSearch.emit(this.filterModel);
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

    get internalDisclaimerGroup() {
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

    private parseDisclaimers(obj, config: IDisclaimerConfig[]): PoDisclaimer[] {
        let disclaimers: PoDisclaimer[] = [];
        config.forEach(param => {
            if (!isNullOrUndefined(obj[param.property])) {
                let value = '';
                if (param.type === 'date')
                    value = TotvsGpsDateUtils.getInstance().getLocaleDate(obj[param.property])
                else
                    value = String(obj[param.property]).valueOf();
                if (value === '')
                    return;
                if (!isNullOrUndefined(param.value))
                    value = param.value(value);
                let item: PoDisclaimer = disclaimers.find(item => item.property == (param.group || param.property));
                if (isNullOrUndefined(item)) {
                    item = { property: (param.group || param.property), hideClose: true, value: value };
                    disclaimers.push(item);
                }
                else
                    item.value += (param.separator || '') + value;
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