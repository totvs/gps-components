import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData } from "../gps-page.internal-model";
import { PoPageDetailComponent } from "@po-ui/ng-components";
import { UrlSegment } from "@angular/router";
import { ICRUDService } from "../models/gps-page.model";
import { TotvsGpsCustomService } from "totvs-gps-custom";

@Component({
    selector: 'gps-page-detail',
    templateUrl: './gps-page-detail.component.html',
})
export class GpsPageDetailComponent extends GpsPageBaseComponent implements OnInit {

    //#region Portinari properties
    @ViewChild(PoPageDetailComponent, {static:true}) poPageDetailComponent: PoPageDetailComponent;
    @Input('p-breadcrumb') parameterBreadcrumb;
    @Input('p-literals') parameterLiterals;
    @Output('p-back') parameterOnBack? = new EventEmitter();
    @Output('p-edit') parameterOnEdit? = new EventEmitter();
    @Output('p-remove') parameterOnRemove? = new EventEmitter();
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
        this.poPageDetailComponent.back = this.parameterOnBack;
        this.poPageDetailComponent.edit = this.parameterOnEdit;
        this.poPageDetailComponent.remove = this.parameterOnRemove;
    }
    //#endregion    

    /**
     * @description Inicializa a classe com os dados necessários para processamento dos campos customizáveis
     * no detalhe de registros.
     * @param appName Nome no menu do programa onde os customs serão aplicados (Ex.: hvp.benefMultiplierFactor)
     * @param detail Nome do programa que será disparado para buscar os campos customizáveis (Ex.: benef-multiplier-factor-detail)
     * @param urlSegments Segmentos da URL do registro padrão
     * @param crudService Instância da classe service do CRUD em questão.
     */
    public setupCustomFields(appName: string,
        detail: string,
        urlSegments: UrlSegment[],
        crudService: ICRUDService<any>) {

        this._appName = appName;
        this._detail = detail;
        this._urlSegments = urlSegments;
        this._crudService = crudService;

        this.getCustomFields(this._detail);
    }
}