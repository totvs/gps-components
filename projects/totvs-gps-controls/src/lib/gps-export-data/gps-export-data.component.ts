import { Component, Input, ViewChild, PipeTransform, ChangeDetectorRef } from "@angular/core";
import { isNullOrUndefined, isBoolean } from "util";
import { PoModalComponent, PoModalAction } from "@portinari/portinari-ui";
import { IOrderListItem } from "../totvs-gps-controls.model";
import { GpsOrderListComponent } from "../gps-order-list/gps-order-list.component";

export interface IExportColumn {
    property:string;
    label?:string;
    transform?:Function;
    pipe?:PipeTransform;
    pipeArgs?:any[];
}

@Component({
  selector: 'gps-export-data',
  templateUrl: './gps-export-data.component.html'
})
export class GpsExportDataComponent {

    @Input('data') data: any[];
    @Input('columns') columns: IExportColumn[];
    @Input('fileName') fileName: string = 'file.csv';
    @Input('canChoose') 
        get canChoose() { return this._canChoose }
        set canChoose(value:any) { this._canChoose = isBoolean(value) ? value : (value != 'false') }

    private _canChoose: boolean = false;

    @ViewChild('modal', {static:true}) modal: PoModalComponent;
    @ViewChild('orderListComponent', {static:true}) orderListComponent: GpsOrderListComponent;

    originalColumns: IOrderListItem[] = [];
    orderedColumns: IOrderListItem[] = [];

    confirmAction: PoModalAction = {
        label: 'Exportar',
        action: () => { this.doExport(this.getColumns()) }
    }

    cancelAction: PoModalAction = {
        label: 'Cancelar',
        action: () => { this.closeModal(); }
    }

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    };

    export(columnSelection?:boolean) {
        if (!isNullOrUndefined(this.columns)) {
            this.originalColumns = this.columns.map(item => { return { label: (item.label || item.property), value: item.property }});
            this.changeDetectorRef.detectChanges();
        }
        else
            return;

        if (columnSelection === true)
            this.modal.open();
        else
            this.doExport(this.originalColumns);
    }

    private getColumns(): IOrderListItem[] {
        this.orderedColumns = this.orderListComponent.getOrderedList();
        return this.orderedColumns;
    }

    private doExport(columns: IOrderListItem[]) {
        let exportColumns = columns.map(item => this.columns.find(name => name.property == item.value));
        let columnContent = exportColumns.map(item => (item.label || item.property)).join(';');
        let dataContent = this.data.map(item => exportColumns.map(column => this.columnValue(item, column)).join(';'));
        let content = [columnContent,...dataContent].join('\n');
        this.getFile(this.fileName, content);
        this.closeModal();
    }

    private closeModal() {
        this.modal.close();
    }

    private columnValue(item: any, column: IExportColumn) {
        let value: string;
        if (column.pipe)
            value = column.pipe.transform(item[column.property], ...(column.pipeArgs || []));
        else
            value = `${item[column.property]}`;
        if (isNullOrUndefined(value))
            value = '';
        if (!isNullOrUndefined(column.transform)) {
            try {
                value = column.transform(value);
            }
            catch { 
                value = ''; 
            }
        }
        if (value.includes(';'))
            value = `"${value}"`;
        return value;
    }

    private dataToArray(data:string): Blob {
        let byteNumbers = new Array(data.length);
        for (let i=0; i < data.length; i++) {
            byteNumbers[i] = data.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type : 'text/csv'});
    }

    /*
    private base64ToArray(data64): Blob {
        return this.dataToArray(atob(data64));
    }
    */

    private downloadFile(fileName:string, content:Blob) {
        let downloadUrl = window.URL.createObjectURL(content);
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;

        //Para internet explorer
        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveBlob(content, fileName);
            return;
        }        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    public getFile(fileName: string, content: string) {
        this.downloadFile(fileName, this.dataToArray(content));
    }

}
