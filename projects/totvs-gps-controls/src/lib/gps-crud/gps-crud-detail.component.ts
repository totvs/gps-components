import { Component, EventEmitter, Input, Output, AfterContentInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PoNotificationService, PoDialogService } from "@po-ui/ng-components";
import { TotvsStringUtils } from "totvs-gps-utils";
import { ICRUDService } from "./gps-crud.model";
import { GpsCRUDNavigation } from "./gps-crud-navigation.service";
import { GpsCRUDCustomService } from "./gps-crud.service";
import { GpsPageDetailComponent } from "../gps-page/gps-page-detail/gps-page-detail.component";

@Component({
    selector: 'gps-crud-detail',
    templateUrl: '../gps-page/gps-page-detail/gps-page-detail.component.html',
    providers: [GpsCRUDNavigation,GpsCRUDCustomService]
})
export class GpsCrudDetailComponent extends GpsPageDetailComponent implements AfterContentInit {

    @Input('program')
    get program() { return this._program }
    set program(value) { this.setProgram(value) }

    @Input('crud-service')
    get crudService() { return this._crudService }
    set crudService(value) { this.setCrudService(value) }

    @Input('crud-data') crudData: any;
    @Output('crud-dataChange') crudDataChange: EventEmitter<any> = new EventEmitter();

    @Output('on-data') onData: EventEmitter<any> = new EventEmitter();

    @Input('custom-enable') 
    get customEnable() { return this._customEnable }
    set customEnable(value) { this.setCustomEnable(value)  }

    messageLiterals: {removeQuestion,removeSuccess};
    routeParams: Params;
    private routeChanged = false;
    private totvsStringUtils: TotvsStringUtils = TotvsStringUtils.getInstance();

    //#region Startup
    constructor(
        private customService: GpsCRUDCustomService,
        private crudNavigation: GpsCRUDNavigation,
        private notificationService: PoNotificationService,
        private dialogService: PoDialogService,
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
            removeQuestion: 'Deseja confirmar a remoção deste registro?',
            removeSuccess: 'Registro removido com sucesso!'
        };
    }

    private subscribeRoute() {
        this.activatedRoute.params.subscribe(params => this.initData(params));
    }
    //#endregion

    private initData(params?:Params) {
        if (params) {
            this.routeParams = params;
            this.routeChanged = true;
            this.initializePage(params);
        }
        else {
            this.crudNavigation.back()
        }
    }

    private initializePage(args:any) {
        if (this._crudService && this.routeChanged) {
            this.routeChanged = false;
            this.showLoading('Carregando...');
            this._crudService?.get(...Object.values(args))
                .then(result => {
                    this.hideLoading();
                    this.setData(result);
                })
                .catch(() => this.crudNavigation.back());
        }
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

    private removeCustom(): Promise<boolean> {
        if (!this.hasCustomFields) {
            return Promise.resolve(true);
        }
        else {
            return this.customService.delete(this._program, this.routeParams)
                .then(() => true)
                .catch(() => false);
        }
    }

    private remove(): Promise<any> {
        this.showLoading('Removendo...');
        return this.crudService.remove(...Object.values(this.routeParams))
            .then(result => {
                this.removeCustom().finally(() => {
                    this.hideLoading();
                    this.notificationService.success(this.messageLiterals.removeSuccess);
                    this.crudNavigation.back();
                });
            })
            .catch(() => this.hideLoading());
    }

    private actionRemove() {
        this.dialogService.confirm({
            title: 'Remover',
            message: this.messageLiterals.removeQuestion,
            confirm: () => { this.remove() }
        });
    }

    private actionEdit() {
        this.crudNavigation.editRegisterPage(this.crudData);
    }

    private actionBack() {
        this.crudNavigation.back();
    }

    private setPageEvents() {
        this.poPageDetailComponent.remove.subscribe(() => { this.actionRemove() });
        this.poPageDetailComponent.edit.subscribe(() => { this.actionEdit() });
        this.poPageDetailComponent.back.subscribe(() => { this.actionBack() });
    }

    private setData(value?) {
        this.crudData = value;
        this.crudDataChange.emit(this.crudData);
        this.onData.emit(this.crudData);
        this.loadCustomFields();
    }

} 