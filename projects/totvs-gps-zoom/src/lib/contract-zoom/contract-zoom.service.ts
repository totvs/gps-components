import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { Contract, ContractService } from 'totvs-gps-api';
import { map } from 'rxjs/operators';

@Injectable()
export class ContractZoomService implements PoLookupFilter {    


    constructor(public _service: ContractService) {
        this.createColumns();
    }

    //#region Zoom definition
    public columnNames = [
        'modPlanType',
        'proposal',
        'contract',
        'guarantorName',
        'originGuarantorName'
    ]; 
    private readonly columnDefinition = {
        'modPlanType': <PoLookupColumn>{ property: 'modPlanType', label: 'Md/Pl/Tp', width:'15%' },
        'proposal': <PoLookupColumn>{ property: 'proposal', label: 'Proposta', width:'15%' },
        'contract': <PoLookupColumn>{ property: 'contract', label: 'Contrato', width:'15%' },
        'guarantorName': <PoLookupColumn>{ property: 'guarantorName', label: 'Contratante', width:'30%' }, 
        'originGuarantorName': <PoLookupColumn>{ property: 'originGuarantorName', label: 'Contratante origem', width:'25%' }

    };

    COLUMNS: PoLookupColumn[];
    readonly FIELD_VALUE = 'contract';
    readonly FIELD_LABEL = 'guarantorName';
 
    public createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    fieldFormat(value) {
        if (value) {
            let _cod = value.contract;
            let _des = value.guarantorName;
            if (_cod != undefined)
                return `${_cod} - ${_des}`;
        }
        return '';
    }

    getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
        let filter_default = {
            q:params.filter,
            modality:null,
            specialAgeRange:null,
            active:null
        }
        
        if(params.advancedFilters?.status){            
            params.advancedFilters.status = params.advancedFilters.status == 'Todos' ? null : 1;
        }

        let filter = {
            ... params.advancedFilters,
            ... filter_default
        };
        
        if(params.filterParams[0]){
            filter.modality = params.filterParams[0]
        }
        
        if(params.filterParams[2]){
            filter.specialAgeRange = params.filterParams[2]
        }

        if(params.filterParams[3]){
            filter.active = params.filterParams[3]
        }
        
        let result = this._service.getByFilter(filter, params.page, params.pageSize);
        
        return from(result).pipe(map(value =>{
            if(value.items){
                value.items.map((item:Contract) =>{
                    return item['modPlanType'] = `${item.modality}/${item.healthInsuranceCode}/${item.healthInsuranceTypeCode}`;
                })
            }
            return value;
        }));
    }

    getObjectByValue(value: string, params): Observable<any> {        
        if((params[1] && params[1] === true) && value == "0" )
            return of(new Contract().parseJsonToObject({contract: 0, guarantorName: 'Todos'}))

        let search = {
            contractInitial:value,
            contractFinal:value,
            modality: params[0],
            specialAgeRange: null,
            active:null
        }

        if(params[2]){
            search.specialAgeRange = params[2]
        }

        if(params[3]){
            search.active = params[3]
        }

        let result = this._service.getByFilter(search,1,1);
        return from(result).pipe(map(result => result.items[0]));
    }
    //#endregion

}
