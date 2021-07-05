import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData, ICustomFields } from "../gps-page.internal-model";
import { PoPageEditComponent } from "@po-ui/ng-components";
import { IModelFillData } from "../../totvs-gps-controls.model";

@Component({
    selector: 'gps-page-edit',
    templateUrl: './gps-page-edit.component.html',
    providers: []
})
export class GpsPageEditComponent extends GpsPageBaseComponent implements OnInit {

    //#region Portinari properties
    @ViewChild(PoPageEditComponent, {static:true}) poPageEditComponent: PoPageEditComponent;
    @Input('p-breadcrumb') parameterBreadcrumb;
    @Input('p-literals') parameterLiterals;
    @Input('p-disable-submit') parameterDisableSubmit;
    @Output('p-cancel') parameterOnCancel? = new EventEmitter();
    @Output('p-save') parameterOnSave? = new EventEmitter();
    @Output('p-save-new') parameterOnSaveNew? = new EventEmitter();
    //#endregion

    //#region Custom properties
    @Input('model-fill') parameterModelFill: Array<IModelFillData>;
    //#endregion

    //#region startup
    ngOnInit() {
        this.setupActions();
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
    private setupActions() {
        this.poPageEditComponent.cancel = this.parameterOnCancel;
        this.poPageEditComponent.save = this.parameterOnSave;
        this.poPageEditComponent.saveNew = this.parameterOnSaveNew;
    }
    //#endregion

    //#region Custom fields
    hasCustomFields = false;
    customFields: ICustomFields;
    //#endregion
}