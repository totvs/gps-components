import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { GpsPageBaseComponent } from "../gps-page-base.component";
import { ILoadingData } from "../gps-page.internal-model";
import { PoPageDetailComponent } from "@po-ui/ng-components";

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

}