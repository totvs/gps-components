import { Component, Input, ViewContainerRef, Output, EventEmitter, OnInit } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData } from "../gps-page.internal-model";

@Component({
    selector: 'gps-page-detail',
    templateUrl: './gps-page-detail.component.html',
})
export class GpsPageDetailComponent extends GpsPageBaseComponent implements OnInit {

    //#region Portinari properties
    @Input('p-breadcrumb') parameterBreadcrumb;
    @Input('p-literals') parameterLiterals;
    @Output('p-back') parameterOnBack? = new EventEmitter();
    @Output('p-edit') parameterOnEdit? = new EventEmitter();
    @Output('p-remove') parameterOnRemove? = new EventEmitter();
    //#endregion

    //#region startup
    constructor(
        private _viewContainerRef: ViewContainerRef
    ) {
        super();
        this._parentContext = this._viewContainerRef['_view']['component'];
    }

    ngOnInit() {
        this.setupActions();
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

    //#region Page Actions
    private _back(event) {
        this.parameterOnBack.emit(event);
    }
    private _edit(event) {
        this.parameterOnEdit.emit(event);
    }
    private _remove(event) {
        this.parameterOnRemove.emit(event);
    }

    private setupActions() {
        if (this.parameterOnBack.observers.length > 0)
            this['back'] = this._back.bind(this);
        else
            delete this['back'];
        if (this.parameterOnEdit.observers.length > 0)
            this['edit'] = this._edit.bind(this);
        else
            delete this['edit'];
        if (this.parameterOnRemove.observers.length > 0)
            this['remove'] = this._remove.bind(this);
        else
            delete this['remove'];
    }
    //#endregion

}