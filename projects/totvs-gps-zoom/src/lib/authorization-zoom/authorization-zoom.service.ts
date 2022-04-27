import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { Contract, GuideService, ProcedureSolicitationFilter } from 'totvs-gps-api';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthorizationZoomService implements PoLookupFilter {

    constructor(public _service: GuideService) {
        this.createColumns();
    }

    //#region Zoom definition
    public columnNames = [
        'yearAttendanceGuide',
        'attendanceGuide',
        'issueDate',
        'cardUnityNumber',
        'cardNumber',
        'beneficiaryName'
    ]; 
    private readonly columnDefinition = {
        'yearAttendanceGuide': <PoLookupColumn>{ property: 'yearAttendanceGuide', label: 'Ano', width:'10%' },
        'attendanceGuide': <PoLookupColumn>{ property: 'attendanceGuide', label: 'Guia', width:'10%' },
        'issueDate': <PoLookupColumn>{ property: 'issueDate', type: 'date', label: 'Emissão', width:'15%' },
        'cardUnityNumber': <PoLookupColumn>{ property: 'cardUnityNumber', label: 'Unidade', width:'12%' }, 
        'cardNumber': <PoLookupColumn>{ property: 'cardNumber', label: 'Carteira', width:'18%' },
        'beneficiaryName': <PoLookupColumn>{ property: 'beneficiaryName', label: 'Nome', width:'35%' }
    };

    COLUMNS: PoLookupColumn[];
    readonly FIELD_VALUE = 'fullAuthorizationNumber';
    readonly FIELD_LABEL = 'providerName';
 
    public createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    fieldFormat(value) {
        if (value) {
            let _cod = value.fullAuthorizationNumber;
            let _des = value.providerName;
            if (_cod != undefined)
                return `${_cod} - ${_des}`;
        }
        return '';
    }

    getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi> {
        let _filter = {
            q: params.filter,
            ...params.advancedFilters
        };
        
        let result = this._service.getByFilter(_filter, params.page, params.pageSize);
        return from(result);
    }

    getObjectByValue(value: string, params): Observable<any> {
        let _filter = new ProcedureSolicitationFilter();
        
        _filter.guideYear = parseInt(value.substr(0, 4));
        _filter.guideCode = parseInt(value.substr(4));
        _filter.findAllStatus = true;
        _filter.displayOpenPackage = false;

        return from(this._service.getGuideByCode(_filter));
    }
    //#endregion

}
