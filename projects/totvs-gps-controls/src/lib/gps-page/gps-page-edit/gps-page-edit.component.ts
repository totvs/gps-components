import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData, GpsPageAction, ICustomFields } from "../gps-page.internal-model";
import { PoPageEditComponent } from "@po-ui/ng-components";
import { GpsPageService } from "../services/gps-page.service";
import { ActivatedRoute } from "@angular/router";
import { IModelFillData } from "../../totvs-gps-controls.model";

@Component({
    selector: 'gps-page-edit',
    templateUrl: './gps-page-edit.component.html',
    providers: [GpsPageService]
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
    @Input('program') 
        get program() { return this._program }
        set program(value) { this.setProgram(value) }
    @Input('model-fill') parameterModelFill: Array<IModelFillData>;

    @Input('action-save') 
        get actionSave(): GpsPageAction { return this._actionSave }
        set actionSave(value:GpsPageAction) { this.setActionSave(value) }
    @Output('on-save') onSave: EventEmitter<any> = new EventEmitter();
    @Output('on-save-error') onSaveError: EventEmitter<any> = new EventEmitter();

    @Input('action-save-new') 
        get actionSaveNew(): GpsPageAction { return this._actionSaveNew }
        set actionSaveNew(value:GpsPageAction) { this.setActionSaveNew(value) }
    @Output('on-save-new') onSaveNew: EventEmitter<any> = new EventEmitter();
    @Output('on-save-new-error') onSaveNewError: EventEmitter<any> = new EventEmitter();

    @Input('action-cancel') 
        get actionCancel(): GpsPageAction { return this._actionCancel }
        set actionCancel(value:GpsPageAction) { this.setActionCancel(value) }
    @Output('on-cancel') onCancel: EventEmitter<any> = new EventEmitter();
    @Output('on-cancel-error') onCancelError: EventEmitter<any> = new EventEmitter();
    //#endregion

    //#region startup
    constructor(
        private service: GpsPageService,
        private activatedRoute: ActivatedRoute
    ) {
        super();
        this.createCustomEvents();
    }

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
    private _actionSave: GpsPageAction;
    private _actionSaveNew: GpsPageAction;
    private _actionCancel: GpsPageAction;

    private customSaveEvent: EventEmitter<any>;
    private customSaveNewEvent: EventEmitter<any>;
    private customCancelEvent: EventEmitter<any>;

    private setActionSave(value?:GpsPageAction) {
        this._actionSave = value;
        if (this._actionSave) {
            this.poPageEditComponent.save = this.customSaveEvent;
        }
        else {
            this.poPageEditComponent.save = this.parameterOnSave;
        }
    }

    private setActionSaveNew(value?:GpsPageAction) {
        this._actionSaveNew = value;
        if (this._actionSaveNew) {
            this.poPageEditComponent.saveNew = this.customSaveNewEvent;
        }
        else {
            this.poPageEditComponent.saveNew = this.parameterOnSaveNew;
        }
    }

    private setActionCancel(value?:GpsPageAction) {
        this._actionCancel = value;
        if (this._actionCancel) {
            this.poPageEditComponent.cancel = this.customCancelEvent;
        }
        else {
            this.poPageEditComponent.cancel = this.parameterOnCancel;
        }
    }

    private setupActions() {
        if (!(this.poPageEditComponent.save?.observers?.length>0))
            this.poPageEditComponent.save = this.parameterOnSave;
        if (!(this.poPageEditComponent.cancel?.observers?.length>0))
            this.poPageEditComponent.cancel = this.parameterOnCancel;
        if (!(this.poPageEditComponent.saveNew?.observers?.length>0))
            this.poPageEditComponent.saveNew = this.parameterOnSaveNew;
    }
    //#endregion

    //#region Custom
    private _program = ''; // programa/contexto (especifico progress = hgp\custom\programa\contexto.p)
    hasCustomFields = false;
    customFields:ICustomFields;

    private setProgram(value?:string) {
        if (value != this._program) {
            this._program = value;
            this.loadCustomFields();
        }
    }

    private createCustomEvents() {
        this.customSaveEvent = new EventEmitter();
        this.customSaveEvent.subscribe(() => {
            let validate: Promise<any>;
            if (this.hasCustomFields) {
                this.showLoading('Validando dados...');
                validate = this.service.beforeSaveCustomFields(this._program, this.service.convertParamMap(this.activatedRoute.snapshot.paramMap), this.customFields.values);
            }
            else {
                validate = Promise.resolve();
            }
            validate.then(() => {
                this.showLoading('Salvando dados...');
                let result = this._actionSave();
                if (result instanceof Promise) {
                    result
                        .then(value => { 
                            this.saveCustomFields()
                                .then(() => { this.onSave.emit(value) })
                                .finally(() => this.hideLoading());
                        })
                        .catch(error => { 
                            this.hideLoading();
                            this.onSaveError.emit(error) 
                        });
                }
                else {
                    this.hideLoading();
                    this.onSave.emit(result);
                }
            })
            .catch(() => this.hideLoading());
        });

        this.customSaveNewEvent = new EventEmitter();
        this.customSaveNewEvent.subscribe(() => {
            let validate: Promise<any>;
            if (this.hasCustomFields) {
                this.showLoading('Validando dados...');
                validate = this.service.beforeSaveCustomFields(this._program, this.service.convertParamMap(this.activatedRoute.snapshot.paramMap), this.customFields.values);
            }
            else {
                validate = Promise.resolve();
            }
            validate.then(() => {
                this.showLoading('Salvando dados...');
                let result = this._actionSaveNew();
                if (result instanceof Promise) {
                    result
                        .then(value => { 
                            this.saveCustomFields()
                                .then(() => { this.onSaveNew.emit(value) })
                                .finally(() => this.hideLoading());
                        })
                        .catch(error => { 
                            this.hideLoading();
                            this.onSaveNewError.emit(error) 
                        });
                }
                else {
                    this.hideLoading();
                    this.onSaveNew.emit(result);
                }
            })
            .catch(() => this.hideLoading());
        });

        this.customCancelEvent = new EventEmitter();
        this.customCancelEvent.subscribe(() => {
            let result = this._actionCancel();
            if (result instanceof Promise) {
                result
                    .then(value => { this.onCancel.emit(value) })
                    .catch(error => { this.onCancelError.emit(error) });
            }
            else {
                this.onCancel.emit(result);
            }
        });
    }

    private loadCustomFields() {
        this.hasCustomFields = false;
        this.service.getCustomFields(this._program).then(values => {
            if (values?.length > 0) {
                this.customFields = { fields: values  };
                this.hasCustomFields = true;
                this.loadCustomValues();
            }
        });
    }

    private loadCustomValues() {
        this.service.getCustomFieldValues(this._program,  this.service.convertParamMap(this.activatedRoute.snapshot.paramMap)).then(values => {
            this.customFields.values = {};
            values.forEach(value => this.customFields.values[value.property] = value.value);
        });
    }

    private saveCustomFields() {
        if (this.hasCustomFields) {
            return this.service.saveCustomFields(this._program, this.service.convertParamMap(this.activatedRoute.snapshot.paramMap), this.customFields.values);
        }
        return Promise.resolve();
    }
    //#endregion

}