import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { PoTableColumn } from "@portinari/portinari-ui";
import { isNullOrUndefined, isBoolean } from "util";
import { IOrderListItem } from "../totvs-gps-controls.model";

interface IOrderListItemActions extends IOrderListItem {
    $actions: string[];
}

@Component({
    selector: 'gps-order-list',
    templateUrl: './gps-order-list.component.html',
})
export class GpsOrderListComponent implements OnChanges {

    @Input('items') items: IOrderListItem[];
    @Input('columnLabel') columnLabel: string;
    @Input('orderedItems') orderedItems: IOrderListItem[] = [];
    @Output('orderedItemsChange') orderedItemsChange: EventEmitter<IOrderListItem[]> = new EventEmitter();
    @Input('canChoose') 
        get canChoose() { return this._canChoose }
        set canChoose(value:any) { this._canChoose = isBoolean(value) ? value : (value != 'false') }

    private _canChoose: boolean = false;

    private readonly TABLE_ACTIONS = {
        ABOVE: 'above',
        BELOW: 'below'
    };

    itemList: IOrderListItemActions[] = [];
    tableColumns: Array<PoTableColumn> = [
        { property: 'label', label: '' },
        { property: '$actions', label: ' ', type: 'icon', width: '5rem', icons:
            [
                { 
                    value: this.TABLE_ACTIONS.ABOVE,
                    icon: 'po-icon-arrow-down',
                    action: this.onBelow.bind(this)
                },
                { 
                    value: this.TABLE_ACTIONS.BELOW,
                    icon: 'po-icon-arrow-up',
                    action: this.onAbove.bind(this)
                }
            ]
        }
    ];  

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    };

    ngOnChanges() {
        this.refreshList();
        this.tableColumns[0].label = (this.columnLabel || 'Valor');
        this.changeDetectorRef.detectChanges();
    }

    public getOrderedList(): IOrderListItem[] {
        this.updateOutputList();
        return this.orderedItems;
    }

    /*
        Metodos internos ----------------------------------------------------------------------------------------------
    */

    private refreshList() {
        if (isNullOrUndefined(this.items)) {
            this.itemList = [];
        }
        else {
            // elimina itens que não estão na nova lista
            this.itemList = [...this.itemList.filter(item => this.items.find(v => v.value == item.value))];
            // adiciona/atualiza itens
            this.items.forEach(item => {
                let newItem: IOrderListItemActions = this.itemList.find(v => v.value == item.value);
                if (isNullOrUndefined(newItem)) {
                    newItem = { 
                        value: item.value, 
                        label: item.label,
                        data: item, 
                        order: (item.order || (this.itemList.length + 1)), 
                        $actions: [this.TABLE_ACTIONS.ABOVE,this.TABLE_ACTIONS.BELOW]
                    };
                    // deixa o item como selecionado
                    newItem['$selected'] = true;
                    this.itemList.push(newItem);
                }
                newItem.label = item.label;
                newItem.data = item;
            });
        }
        this.sortList();
    }

    private onBelow(param: IOrderListItemActions) {
        if(param.order < this.itemList.length) {
            var idAux = param.order;
            this.itemList[idAux-1].order = this.itemList[idAux-1].order + 1;
            this.itemList[idAux].order = this.itemList[idAux].order - 1;
            this.sortList();
        }
        window.event.cancelBubble = true; //IE
        event.stopPropagation(); //Navegadores
    }
    
    private onAbove(param: IOrderListItemActions) {
        if(param.order>1) {
            var idAux = param.order;
            this.itemList[idAux-1].order = this.itemList[idAux-1].order - 1;
            this.itemList[idAux-2].order = this.itemList[idAux-2].order + 1;
            this.sortList();
        }
        window.event.cancelBubble = true; //IE
        event.stopPropagation(); //Navegadores
    }

    private sortList() {
        this.itemList.sort((a, b) => (a.order < b.order) ? -1 : 1);
        let _order = 0;
        this.itemList.forEach(item => { item.order = ++_order });
        this.updateOutputList();
    }

    private updateOutputList() {
        let selected;
        if (this.canChoose) {
            selected = this.itemList.filter(item => item['$selected']);
            if (selected.length == 0)
                selected = this.itemList;
        }
        else
            selected = this.itemList;

        this.orderedItems = selected.map(item => {
            return <IOrderListItem>{
                order: item.order,
                value: item.value,
                label: item.label,
                data:  item.data
            };
        });
        this.orderedItemsChange.emit(this.orderedItems);
    }


}