import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData, ICustomFields } from "../gps-page.internal-model";
import { PoPageDetailComponent } from "@po-ui/ng-components";
import { GpsPageService } from "../services/gps-page.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'gps-page-detail',
    templateUrl: './gps-page-detail.component.html',
    providers: [GpsPageService]
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

    //#region Custom properties
    @Input('program') 
        get program() { return this._program }
        set program(value) { this.setProgram(value) }
    //#endregion

    //#region startup
    constructor(
        private service: GpsPageService,
        private activatedRoute: ActivatedRoute
    ) {
        super();
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
    private setupActions() {
        this.poPageDetailComponent.back = this.parameterOnBack;
        this.poPageDetailComponent.edit = this.parameterOnEdit;
        this.poPageDetailComponent.remove = this.parameterOnRemove;
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
    //#endregion


}