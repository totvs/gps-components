import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { PoLookupColumn, PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { Unity, UnityService } from 'totvs-gps-api';

@Injectable()
export class HealthInsurerZoomService implements PoLookupFilter{

  constructor(public _service: UnityService) {
    this.createColumns();
  }

  //#region Zoom definition
  public columnNames = [
    'code',
    'description'
  ];
  private readonly columnDefinition = {
      'code': <PoLookupColumn>{ property: 'code', label: 'Código', width:'20%' },
      'description': <PoLookupColumn>{ property: 'description', label: 'Descrição', width:'80%'  },
  };

  COLUMNS: PoLookupColumn[];
  readonly FIELD_VALUE = 'code';
  readonly FIELD_LABEL = 'description';

  public createColumns() {
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

  getFilteredItems(params: PoLookupFilteredItemsParams): Observable<PoLookupResponseApi>{
      // let search = params.filter != "" ? {search:params.filter} : {}
      let result = this._service.getByFilter({search: params.filter}, params.page, params.pageSize);
      return from(result);
  }

  getObjectByValue(value: string, filterParams): Observable<any> {
    if (filterParams[0]){
      if (value && parseInt(value) == 0) {
        return of(new Unity().parseJsonToObject({code: 0, description: 'Todas'}));
      }
    } else {
      if (value && parseInt(value) == 0) {
        return of(null);
      }
    }
  
    return from(this._service.get(Number(value)));
  }

}
