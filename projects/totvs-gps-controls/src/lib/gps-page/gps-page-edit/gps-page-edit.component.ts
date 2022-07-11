import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData } from "../gps-page.internal-model";
import { PoPageEditComponent } from "@po-ui/ng-components";
import { IModelFillData } from "../../totvs-gps-controls.model";
import { UrlSegment } from "@angular/router";
import { ICRUDService } from "../models/gps-page.model";
import { TotvsGpsCustomService } from "totvs-gps-custom";

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

    constructor(private _custom: TotvsGpsCustomService) {
        super();
        this._customService = this._custom;
    }

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

    /**
     * @description Inicializa a classe com os dados necessários para processamento dos campos customizáveis
     * na adição/edição de registros.
     * @param appName Nome no menu do programa onde os customs serão aplicados (Ex.: hvp.benefMultiplierFactor)
     * @param edit Nome do programa que será disparado para buscar os campos customizáveis (Ex.: benef-multiplier-factor-edit)
     * @param editValidate Nome do programa que será disparado para realizar a validação dos campos customizáveis (Ex.: benef-multiplier-factor-edit-validate)
     * @param editSave Nome do programa que será disparado para realizar a gravação dos campos customizáveis (Ex.: benef-multiplier-factor-edit-save)
     * @param useOffset Indica se será injetado o CSS 'po-offset-md-3 po-offset-lg-3 po-offset-xl-3' para telas que utilizam offset
     * @param urlSegments Segmentos da URL do registro padrão
     * @param crudService Instância da classe service do CRUD em questão.
     */
    public setupCustomFields(appName: string,
        edit: string,
        editValidate: string,
        editSave: string,
        urlSegments: UrlSegment[],
        crudService: ICRUDService<any>) {        

        this._appName = appName;
        this._edit = edit;
        this._editValidate = editValidate;
        this._editSave = editSave;
        this._urlSegments = urlSegments;
        this._crudService = crudService;

        this.getCustomFields(this._edit);
    }

}