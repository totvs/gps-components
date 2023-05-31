import { Observable, from, of } from 'rxjs';
import { LedgerAccountService } from 'totvs-gps-api';
import { Injectable } from '@angular/core';
import { PoLookupFilter, PoLookupColumn, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';

@Injectable()
export class LedgerAccountZoom implements PoLookupFilter {

    constructor(private service:LedgerAccountService) {
        this.createColumns();
    }

    private readonly columnNames = [
        'code',
        'description',
        'kindAccount'
    ];
    private readonly columnDefinition = {
        'code': <PoLookupColumn>{ property: 'code', label: 'Código' , width: '20%'},
        'description': <PoLookupColumn>{ property: 'description', label: 'Descrição', width: '50%' },
        'kindAccount': <PoLookupColumn> { property: 'kindAccount', label: 'Tipo'}
    };

    public COLUMNS: Array<PoLookupColumn>;
    public FIELD_LABEL: string = 'description';
    public FIELD_VALUE: string = 'code';

    private createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    fieldFormat(value) {
        if (value) {
            let _cod = value.code;
            let _des = value.description;
            if (_cod != undefined)
                return `${_cod} - ${_des}`;
        }
        return '';
    }

    getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
        let _filter = {
            q: params.filter,
            kindAccountDifferent: null
        };

        if (params.filterParams[0])
            _filter.kindAccountDifferent = params.filterParams[0];

        let result = this.service.getByFilter(_filter, params.page, params.pageSize);
        return from(result);
    }

    getObjectByValue(code, params): Observable<any> {
        let _filter = {
            kindAccountDifferent: null,
            code: code,
        };

        if (params[0])
            _filter.kindAccountDifferent = params[0];

        let result = this.service.getByFilter(_filter, params.page, params.pageSize);
        return from(result).pipe(map(collection => {
            return collection.items[0];
        }));
    }
}
