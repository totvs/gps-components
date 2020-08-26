import { Component, EventEmitter, Input, Output, AfterContentInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PoNotificationService } from "@po-ui/ng-components";
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

    @Input('validate') crudValidate: ValidateAction;

    isNew: boolean = true;
    messageLiterals: {insertSuccess,updateSuccess};

    //#region Startup
    constructor(
        private customService: GpsCRUDCustomService,
        private crudNavigation: GpsCRUDNavigation,
        private notificationService: PoNotificationService,
        private activatedRoute: ActivatedRoute
    ) {
        super();
        this.initLiterals();
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
    //#endregion

    private initData() {
        this.getObjectFromRouteParams()
            .then(result => {
                this.initializePage(Object.values(result));
            })
            .catch(() => this.crudNavigation.back());
    }

    private getObjectFromRouteParams(): Promise<any> {
        return new Promise(resolve => {
            this.activatedRoute.params.subscribe(params => {
                if (Object.keys(params).length == 0) {
                    resolve(null);
                }
                resolve(Object.assign({}, params));
            });
        });
    }

    private initializePage(args?:any) {
        if (!args) {
            this.initializeAddPage();
        }
        else {
            this.initializeEditPage(args);
        }
    }

    private initializeAddPage() {
        this.isNew = true;
        this.setData();
    }

    private initializeEditPage(args:any) {
        this.showLoading('Carregando...');
        this._crudService.get(...Object.values(args))
            .then(result => {
                this.hideLoading();
                this.isNew = false;
                this.setData(result);
            })
            .catch(() => this.crudNavigation.back());
    }

    private newModelInstance() {
        return {};
    }

    //#region Service
    private _crudService: ICRUDService<any>;

    private setCrudService(value?: ICRUDService<any>) {
        this._crudService = value;
        if (this._crudService) {
            this.initData();
        }
    }
    //#endregion

    //#region Custom fields
    private _program = ''; // programa/contexto (especifico progress = hgp\custom\programa\contexto.p)

    private setProgram(value?: string) {
        if (value != this._program) {
            this._program = value?.trim();
            this.loadCustomFields();
        }
    }

    private loadCustomFields() {
        this.hasCustomFields = false;
        if ((this._program && this._program != '') && (this._crudService)) {
            this.customService.getFields(this._program).then(values => {
                if (values?.length > 0) {
                    this.customFields = { fields: values  };
                    this.hasCustomFields = true;
                    this.loadCustomValues(); 
                }
            });
        }
    }

    private loadCustomValues() {
        if (this.hasCustomFields && this._crudService && !this.customFields.values) {
            this.customFields.values = {};
            this.customService.getValues(this._program, this.customService.convertParamMap(this.activatedRoute.snapshot.paramMap)).then(values => {
                values.forEach(value => this.customFields.values[value.property] = value.value);
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
            return this.customService.validate(this._program, this.crudData, this.customFields?.values)
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

    private save(): Promise<any> {
        return this.isNew ?
            this._crudService.insert(this.crudData).then(value => { this.notificationService.success(this.messageLiterals.insertSuccess); return value; })
          : this._crudService.update(this.crudData).then(value => { this.notificationService.success(this.messageLiterals.updateSuccess); return value; });
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
        this.loadCustomValues();
    }

} 