import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { HealthProvider, HealthProviderService } from 'totvs-gps-api';
import { GpsStringUtils } from 'totvs-gps-utils';

@Injectable()
export class HealthProviderZoomService implements PoLookupFilter{

    constructor(public healthProviderService: HealthProviderService) {
        this.createColumns();
    }

    private readonly columnNames = [
        'code',
        'name',
        'taxpayerRegistry',
        'professionalCouncilNumber'
    ];
    private readonly columnDefinition = {
        'code': <PoLookupColumn>{ property: 'code', label: 'Código', width:'15%' },
        'name': <PoLookupColumn>{ property: 'name', label: 'Nome', width:'40%' },
        'taxpayerRegistry': <PoLookupColumn>{ property: 'taxpayerRegistry', label: 'CPF/CNPJ', width: '30%' },
        'professionalCouncilNumber': <PoLookupColumn>{ property: 'professionalCouncilNumber', label: 'CRM', width: '15%' }                
    };


    COLUMNS: PoLookupColumn[];
    readonly FIELD_VALUE = 'code';
    readonly FIELD_LABEL = 'name';

    public createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    fieldFormat(value) {
        if (value) {
            let _cod = value.code;
            let _des = value.name;
            if (_cod != undefined)
                return `${_cod} - ${_des}`;
        }
        return '';
    }

    getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
        let search = {search:params.filter, healthInsurerCode:params.filterParams}
        let result = this.healthProviderService.getHealthProviderByFilter(search, params.page, params.pageSize);
        return from(result).pipe(map(value => {
            for(let i in value.items){
                value.items[i].taxpayerRegistry = GpsStringUtils.formatTaxpayerNumber(value.items[i].taxpayerRegistry);
            }
            return value
        }));
    }

    getObjectByValue(value: string, filterParams): Observable<any> {
        if (value && value == '0') {
            return of(new HealthProvider().parseJsonToObject({code: 0, name: 'Todos'}))
        }
        return from(this.healthProviderService.get(filterParams, Number.parseInt(value)));
    }
}
