import { Component, ViewChild, isDevMode, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { PoModalComponent, PoTableColumn, PoTableComponent, PoModalAction } from '@po-ui/ng-components';
import { TotvsGpsServices } from 'totvs-gps-services';
import { IModelFillData } from '../totvs-gps-controls.model';

@Component({
  selector: 'gps-model-fill',
  templateUrl: './gps-model-fill.component.html',
  styleUrls: ['./gps-model-fill.component.css']
})
export class GpsModelFillComponent implements AfterViewInit {

    @Input('model') model: Array<IModelFillData>;

    @ViewChild('modal', {static:false}) modal: PoModalComponent;
    @ViewChild('table', {static:false}) table: PoTableComponent;

    private readonly FORCE_ACTIVATE_PROD = 'mode=dev';
    private _canActivate = false;

    columns: PoTableColumn[] = [
        { property: 'description', label: 'Informação' }
    ];
    primaryAction: PoModalAction = { label: 'Obter', action: this.onConfirm.bind(this) };
    secondaryAction: PoModalAction = { label: 'Fechar', action: this.onCancel.bind(this) };

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        this._canActivate = false;
        if (isDevMode()) {
            this._canActivate = true;
        }
        else {
            let urlParams = window.location.href.split('?');
            if (urlParams.length == 2) {
                let queryParams = urlParams[1].split('&');
                if (queryParams.find(item => item == this.FORCE_ACTIVATE_PROD)) {
                    this._canActivate = true;
                }
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    get canActivate() {
        return (this._canActivate) && (this.model?.length > 0);
    }

    onClick() {
        this.table.selectRow(this.model[0]);
        this.hideLoading();
        this.modal.open();
    }

    private showLoading() {
        this.primaryAction.disabled = true;
        this.secondaryAction.disabled = true;
    }

    private hideLoading() {
        this.primaryAction.disabled = false;
        this.secondaryAction.disabled = false;
    }

    private onConfirm() {
        let selection = this.table.getSelectedRows();
        if (selection.length > 0) {
            this.showLoading();
            let selected: IModelFillData = selection[0];
            TotvsGpsServices.getInstance<any>(Object, selected.url)
                .get()
                .then(value => Object.assign(selected.model, value))
                .finally(() => {
                    this.hideLoading();
                    this.modal.close();
                });
        }
    }

    private onCancel() {
        this.modal.close();
    }

}
