import { Component, EventEmitter, Input, Output, AfterContentInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PoNotificationService } from "@po-ui/ng-components";
import { TotvsStringUtils } from "totvs-gps-utils";
import { GpsPageEditComponent } from "../gps-page/gps-page-edit/gps-page-edit.component";
import { ICRUDService, ValidateAction } from "./gps-crud.model";
import { GpsCRUDNavigation } from "./gps-crud-navigation.service";
import { GpsCRUDCustomService } from "./gps-crud.service";


@Component({
    selector: 'gps-crud-edit',
    templateUrl: '../gps-page/gps-page-edit/gps-page-edit.component.html',
    providers: [GpsCRUDNavigation,GpsCRUDCustomService]
})
export class GpsCrudEditComponent extends GpsPageEditComponent implements AfterContentInit {

    @Input('program')
    get program() { return this._program }
    set program(value) { this.setProgram(value) }

    @Input('crud-service')
    get crudService() { return this._crudService }
    set crudService(value) { this.setCrudService(value) }

    @Input('crud-data') crudData: any;
    @Output('crud-dataChange') crudDataChange: EventEmitter<any> = new EventEmitter();

    @Input('is-new') isNew: boolean = true;
    @Output('is-newChange') isNewChange: EventEmitter<boolean> = new EventEmitter();

    @Input('validate') crudValidate: ValidateAction;

    @Input('custom-enable') 
    get customEnable() { return this._customEnable }
    set customEnable(value) { this.setCustomEnable(value)  }

    messageLiterals: {insertSuccess,updateSuccess};
    routeParams: Params;
    private routeChanged = false;
    private totvsStringUtils: TotvsStringUtils = TotvsStringUtils.getInstance();

    //#region Startup
    constructor(
        private customService: GpsCRUDCustomService,
        private crudNavigation: GpsCRUDNavigation,
        private notificationService: PoNotificationService,
        private activatedRoute: ActivatedRoute
    ) {
        super();
        this.initLiterals();
        this.subscribeRoute();
    }

    ngAfterContentInit() {
        this.setPageEvents();
    }

    private initLiterals() {
        this.messageLiterals = {
            insertSuccess: 'Registro cadastrado com sucesso!',
            updateSuccess: 'Registro alterado com sucesso!'
        };
    }

    private subscribeRoute() {
        this.activatedRoute.params.subscribe(params => this.initData(params));
    }
    //#endregion

    private setIsNew(value: boolean) {
        this.isNew = value;
        this.isNewChange.emit(this.isNew);
    }

    private initData(params?:Params) {
        this.routeParams = params;
        this.routeChanged = true;
        this.initializePage(params);
    }

    private initializePage(args:any) {
        if (Object.values(args).length == 0) {
            this.initializeAddPage();
        }
        else {
            this.initializeEditPage(args);
        }
    }

    private initializeAddPage() {
        this.setIsNew(true);
        this.routeChanged = false;
        this.setData();
    }

    private initializeEditPage(args:any) {
        if (this._crudService && this.routeChanged) {
            this.routeChanged = false;
            this.showLoading('Carregando...');
            this._crudService.get(...Object.values(args))
                .then(result => {
                    this.hideLoading();
                    this.setIsNew(false);
                    this.setData(result);
                })
                .catch(() => this.crudNavigation.back());
        }
    }

    private newModelInstance() {
        return {};
    }

    //#region Service
    private _crudService: ICRUDService<any>;

    private setCrudService(value?: ICRUDService<any>) {
        this._crudService = value;
        this.initializePage(this.routeParams);
    }
    //#endregion

    //#region Custom fields
    private _program = ''; // programa/contexto (especifico progress = hgp\custom\programa\contexto.p)
    private _customEnable: boolean = true;

    private setProgram(value?: string) {
        if (value != this._program) {
            this._program = value?.trim();
            this.loadCustomFields();
        }
    }

    private setCustomEnable(value:any) {
        let bValue = this.totvsStringUtils.toBoolean(value);
        if (bValue != this._customEnable) {
            this._customEnable = bValue;
            this.loadCustomFields();
        }
    }

    private loadCustomFields() {
        this.hasCustomFields = false;
        this.customFields = null;
        if ((this._program && this._program != '') && (this._crudService) && (this.crudData) && (this._customEnable)) {
            this.customService.getFields(this._program, this.routeParams).then(result => {
                if (result?.fields?.length > 0) {
                    this.customFields = { fields: result.fields, values: (result.values || {})  };
                    this.hasCustomFields = true;
                }
            });
        }
    }
    //#endregion

    private validateData(): Promise<boolean> {
        if (this.crudValidate) {
            let result = this.crudValidate();
            if (result instanceof Promise) {
                return result;
            }
            return Promise.resolve(result);
        }
        else {
            return Promise.resolve(true);
        }
    }

    private validateCustom(): Promise<boolean> {
        if (!this.hasCustomFields) {
            return Promise.resolve(true);
        }
        else {
            return this.customService.validate(this._program, this.routeParams, this.crudData, this.customFields?.values)
                .then(() => true)
                .catch(() => false);
        }
    }

    private validate(): Promise<boolean> {
        return this.validateData().then(result => {
            if (!result) {
                return false;
            }
            return this.validateCustom();
        });
    }

    private saveData() {
        return this.isNew ?
            this._crudService.insert(this.crudData)
          : this._crudService.update(this.crudData);
    }

    private saveCustom(resultData) {
        if (!this.hasCustomFields) {
            return Promise.resolve();
        }
        else {
            return this.customService.save(this._program, this.routeParams, resultData, this.customFields?.values);
        }
    }

    private save(): Promise<any> {
        return this.saveData().then(result => this.saveCustom(result).then(() => this.notificationService.success(this.isNew ? this.messageLiterals.insertSuccess : this.messageLiterals.updateSuccess)));
    }

    private actionSave() {
        this.showLoading('Validando informações');
        this.validate().then(validateResult => {
            this.hideLoading();
            if (validateResult) {
                this.showLoading('Salvando dados...');
                this.save().then(result => {
                    this.hideLoading();
                    this.crudNavigation.back();
                })
                .catch(() => this.hideLoading());
            }
        })
        .catch(() => this.hideLoading());
    }

    private actionBack() {
        this.crudNavigation.back();
    }

    private setPageEvents() {
        this.poPageEditComponent.save.subscribe(() => { this.actionSave() });
        this.poPageEditComponent.cancel.subscribe(() => { this.actionBack() });
    }

    private setData(value?) {
        this.crudData = this.newModelInstance();
        if (value) {
            Object.assign(this.crudData, value);
        }
        this.crudDataChange.emit(this.crudData);
        this.loadCustomFields();
    }

} 