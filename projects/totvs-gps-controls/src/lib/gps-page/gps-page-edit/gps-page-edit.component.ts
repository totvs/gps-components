import { Component, Input, ViewContainerRef, Output, EventEmitter, OnInit } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData } from "../gps-page.internal-model";

@Component({
    selector: 'gps-page-edit',
    templateUrl: './gps-page-edit.component.html',
})
export class GpsPageEditComponent extends GpsPageBaseComponent implements OnInit {

    //#region Portinari properties
    @Input('p-breadcrumb') parameterBreadcrumb;
    @Input('p-literals') parameterLiterals;
    @Input('p-disable-submit') parameterDisableSubmit;
    @Output('p-cancel') parameterOnCancel? = new EventEmitter();
    @Output('p-save') parameterOnSave? = new EventEmitter();
    @Output('p-save-new') parameterOnSaveNew? = new EventEmitter();
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
    private _cancel(event) {
        this.parameterOnCancel.emit(event);
    }
    private _save(event) {
        this.parameterOnSave.emit(event);
    }
    private _saveNew(event) {
        this.parameterOnSaveNew.emit(event);
    }

    private setupActions() {
        if (this.parameterOnCancel.observers.length > 0)
            this['cancel'] = this._cancel.bind(this);
        else
            delete this['cancel'];
        if (this.parameterOnSave.observers.length > 0)
            this['save'] = this._save.bind(this);
        else
            delete this['save'];
        if (this.parameterOnSaveNew.observers.length > 0)
            this['saveNew'] = this._saveNew.bind(this);
        else
            delete this['saveNew'];
    }
    //#endregion

}