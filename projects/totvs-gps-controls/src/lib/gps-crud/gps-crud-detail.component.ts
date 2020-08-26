import { Component, EventEmitter, Input, Output, AfterContentInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PoNotificationService, PoDialogService } from "@po-ui/ng-components";
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

    messageLiterals: {removeQuestion,removeSuccess};

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
    //#endregion

    private initData() {
        this.getObjectFromRouteParams()
            .then(result => {
                this.initializePage(result);
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

    private initializePage(args:any) {
        this.showLoading('Carregando...');
        this._crudService?.get(...Object.values(args))
            .then(result => {
                this.hideLoading();
                this.setData(result);
            })
            .catch(() => this.crudNavigation.back());
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

    private actionRemove() {
        this.getObjectFromRouteParams()
            .then(result => {
                this.dialogService.confirm({
                    title: 'Remover',
                    message: this.messageLiterals.removeQuestion,
                    confirm: () => {
                        this.showLoading('Removendo...');
                        this.crudService.remove(...Object.values(result))
                            .then(result => {
                                this.notificationService.success(this.messageLiterals.removeSuccess);
                                this.crudNavigation.back();
                            })
                            .finally(() => this.hideLoading());
                    }
                });
            })
            .catch(() => this.crudNavigation.back());
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
        this.loadCustomValues();
    }

} 