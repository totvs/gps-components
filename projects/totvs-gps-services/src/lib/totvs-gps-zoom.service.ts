import { IZoomColumn, FilterValue, GenericZoomEntity, GenericZoomOption } from "./totvs-gps-zoom.model";
import { Observable, from } from "rxjs";
import { TTalkCollection } from "./totvs-gps-services.model";
import { isNullOrUndefined } from "util";
import { TotvsGpsServices } from "./totvs-gps-services.component";
import { generateKeyPath, getLookupColumns, getObjectFieldLabel, getObjectFieldValue, getFieldsList, getODataFilter } from "./totvs-gps-services.utils";

export interface IZoomService {
  COLUMNS: Array<IZoomColumn>;
  FIELD_LABEL: string;
  FIELD_VALUE: string;
  getFilteredData(filter: any, page: number, pageSize?: number, filterParams?: any): Observable<TTalkCollection<any>>;
  getObjectByValue(value: string, filterParams?: any): Observable<any>;
}

export interface TTalkCollectionZoom<T> extends TTalkCollection<T> {
  position?: number;
}

export class GenericZoomService<T> {
  private _url: string = '';
  private _zoomTable: string;

  public setUrl(url) {
    this._url = url;
  }

  public setZoomTable(zoomTable) {
    this._zoomTable = zoomTable;
  }

  public buildObjectByFilter(searchObject?: any, pageNumber?: number, pageSize?: number, objectPosition?: number, additionalQuery?: string, fields?: string[], expand?: string[]): Promise<TTalkCollectionZoom<T>> {
    let params: any = {};
    if (!isNullOrUndefined(this._zoomTable)) {
      params.ZOOM_TABLE = this._zoomTable;
    }
    if ((!isNullOrUndefined(objectPosition)) && (objectPosition > 0)) {
      params.OBJECT_POSITION = objectPosition;
    }
    if ((!isNullOrUndefined(additionalQuery)) && (additionalQuery.trim().length > 0)) {
      params.ADDITIONAL_QUERY = additionalQuery;
    }
    if (!isNullOrUndefined(searchObject)) {
      if (Array.isArray(searchObject)) {
        searchObject.forEach((filterValue: FilterValue) => {
          params[filterValue.property] = filterValue.filterValue;
        });
      }
      else {
        Object.assign(params, searchObject);
      }
    }

    return TotvsGpsServices.getInstance<T>(GenericZoomEntity, this._url)
      .setPage(pageNumber).setPageSize(pageSize).setFields(fields).setExpand(expand)
      .setQueryParams(params)
      .getCollection();
  }

  public getObjectByFilter(searchObject?: any, pageNumber?: number, pageSize?: number, objectPosition?: number, additionalQuery?: string, fields?: string[], expand?: string[]): Observable<TTalkCollectionZoom<T>> {
    return from(this.buildObjectByFilter(searchObject, pageNumber, pageSize, objectPosition, additionalQuery, fields, expand));
  }

  public buildObjectById(object?: any, fields?: string[], filterParams?: any, additionalQuery?: string): Promise<T> {
    let url = this._url;
    let params: any = {};
    let service = TotvsGpsServices.getInstance<T>(GenericZoomEntity).setFields(fields);

    // se utiliza filtro OData
    if (!isNullOrUndefined(object['$filter'])) {
      url += 'id/';
      Object.assign(params, object);
    }
    // caso tenha enviado filtro completo
    else {
      url += generateKeyPath(object);
      service.setPathParams(object);
    }

    if (!isNullOrUndefined(this._zoomTable)) {
      params.ZOOM_TABLE = this._zoomTable;
    }

    return service.setURL(url).setQueryParams(params).get();
  }

  public getObjectById(object?: any, fields?: string[], filterParams?: any, additionalQuery?: string): Observable<T> {
    return from(this.buildObjectById(object, fields));
  }
}

export class GenericZoom implements IZoomService {
  public readonly genericUrl = 'global/v1/genericZoom/';

  public COLUMNS: IZoomColumn[];
  public FIELD_LABEL: string = '';
  public FIELD_VALUE: string = '';
  private selectedObject: any;
  private service: GenericZoomService<GenericZoomEntity>;
  private objectPosition: number = 0;

  public genericZoomEntity: GenericZoomEntity = new GenericZoomEntity();

  constructor(entity?: GenericZoomEntity) {
    if (entity)
      this.genericZoomEntity = entity;
    this.createColumns();
    this.service = new GenericZoomService();

    if (!isNullOrUndefined(this.genericZoomEntity.apiUrl))
      this.service.setUrl(this.genericZoomEntity.apiUrl);
    else
      this.service.setUrl(this.genericUrl);

    if (!isNullOrUndefined(this.genericZoomEntity.zoomTable))
      this.service.setZoomTable(this.genericZoomEntity.zoomTable);

    this.FIELD_LABEL = this.fieldLabel();
    this.FIELD_VALUE = this.fieldValue();
  }

  private createColumns() {
    this.COLUMNS = [];
    if (isNullOrUndefined(this.genericZoomEntity.columnDefinition))
      getLookupColumns(this.genericZoomEntity).forEach(column => this.COLUMNS.push(column));
    else this.genericZoomEntity.columnDefinition.forEach(column => this.COLUMNS.push(column));
  }

  private fieldLabel(): any {
    if (isNullOrUndefined(this.genericZoomEntity.fieldLabel)) {
      return getObjectFieldLabel(this.genericZoomEntity).toString();
    }
    else {
      return this.genericZoomEntity.fieldLabel;
    }
  }
  private fieldValue(): any {
    if (isNullOrUndefined(this.genericZoomEntity.fieldValue)) {
      return getObjectFieldValue(this.genericZoomEntity).toString();
    }
    else {
      return this.genericZoomEntity.fieldValue;
    }
  }

  public getFilteredData(filter: string, page: number, pageSize: number, filterParams?: any): Observable<any> {

    let genericZoomOption: GenericZoomOption = new GenericZoomOption();
    let additionalQuery: string = "";

    if (!isNullOrUndefined(filter) && (filter.length > 0)) {
    let sf = new FilterValue("search", filter);
      genericZoomOption.filters.push(sf);
      genericZoomOption.filter = filter;
    }
    genericZoomOption.filterParams = filterParams;

    if (page === 1)
      this.objectPosition = 0;

    if (!isNullOrUndefined(genericZoomOption.filterParams)) {
      this.prepareToFilter(genericZoomOption, this.genericZoomEntity);
      if (!isNullOrUndefined(genericZoomOption.filterParams["additionalQuery"]))
        additionalQuery = genericZoomOption.filterParams["additionalQuery"];
    }

    if (!isNullOrUndefined(genericZoomOption.fields)) {
      if (!isNullOrUndefined(genericZoomOption.filters)) {
        this.selectedObject = this.service.buildObjectByFilter(
          genericZoomOption.filters,
          page,
          pageSize,
          genericZoomOption.objectPosition,
          additionalQuery,
          genericZoomOption.fields);

      }
      else {
        this.selectedObject = this.service.buildObjectByFilter(
          genericZoomOption.oDataFilter,
          page,
          pageSize,
          genericZoomOption.objectPosition,
          additionalQuery,
          genericZoomOption.fields);
      }
    }
    else {
      this.selectedObject = this.service.buildObjectByFilter(genericZoomOption.filters, page, pageSize);
    }

    this.selectedObject.then((result) => {
      if (!isNullOrUndefined(result)
        && !isNullOrUndefined(result.position))
        this.objectPosition = result.position;
    });

    return from(this.selectedObject);
  }

  public getObjectByValue(value: string, filterParams?: any): Observable<any> {

    let temporaryObject = new Object();
    let result;
    let genericZoomOption: GenericZoomOption = new GenericZoomOption();

    genericZoomOption.filterParams = filterParams;
    if(isNullOrUndefined(genericZoomOption.filterParams)){
      this.copyObjectValues(this.genericZoomEntity,temporaryObject);
      this.genericZoomEntity.setZoomByIdProperty(value);
    }

    if (!isNullOrUndefined(genericZoomOption.filterParams)) {
      this.copyObjectValues(filterParams, temporaryObject);
      if (!isNullOrUndefined(genericZoomOption.filterParams["setZoomByIdProperty"]))
        genericZoomOption.filterParams.setZoomByIdProperty(value);

      //if (!isNullOrUndefined(genericZoomOption.filterParams["additionalQuery"]))
      //  additionalQuery = genericZoomOption.filterParams["additionalQuery"];

      this.prepareToFilter(genericZoomOption, this.genericZoomEntity);

      //byvalue does not need object position
      genericZoomOption.objectPosition = 0;

      let filterObject = Object.create(genericZoomOption.filterParams);
      filterObject.setZoomByIdProperty(value);

      if (!isNullOrUndefined(genericZoomOption.oDataFilter) && !isNullOrUndefined(genericZoomOption.oDataFilter['$filter'])) {
        result = this.service.getObjectById(
          genericZoomOption.oDataFilter,
          genericZoomOption.fields,
          genericZoomOption.filters);
        if(!isNullOrUndefined(filterParams)) {
          this.copyObjectValues(temporaryObject, filterParams);
        }
        else {
          this.copyObjectValues(temporaryObject, this.genericZoomEntity);
        }
        return result;
      }

      result = this.service.getObjectById(
        filterObject,
        genericZoomOption.fields,
        genericZoomOption.filters);
      this.copyObjectValues(temporaryObject, filterParams);
      return result;
    }

    this.copyObjectValues(temporaryObject, filterParams);
    return this.service.getObjectById(this.genericZoomEntity);
  }

  /*public getSelectedObject() {
    let a: any;
    a = Object.create(this.selectedObject);
    return a;
  }*/

  public getZoomFieldFormat(value): string {
    return `${value[this.FIELD_VALUE]} - ${this.FIELD_LABEL}`;
  }

  public prepareToFilter(genericZoomOption: GenericZoomOption, genericZoomEntity: GenericZoomEntity): GenericZoomOption {
    let filterObject = Object.create(genericZoomOption.filterParams);

    if (filterObject["toFilterValue"] != null) {
      genericZoomOption.filters = genericZoomOption.filters.concat(filterObject.toFilterValue());
    }

    genericZoomOption.fields = getFieldsList(genericZoomOption.filterParams);

    if ((!isNullOrUndefined(genericZoomOption.fields)) && (genericZoomOption.fields.length > 0)) {
      genericZoomOption.oDataFilter = getODataFilter(genericZoomOption.filterParams, genericZoomOption.filter, genericZoomEntity);

      if (!isNullOrUndefined(genericZoomOption.oDataFilter)
        && !isNullOrUndefined(genericZoomOption.oDataFilter['$filter']))
        genericZoomOption.filters = null;
    }

    if (!isNullOrUndefined(this.objectPosition)
      && this.objectPosition > 0)
      genericZoomOption.objectPosition = this.objectPosition;

    return genericZoomOption;
  }

  public copyObjectValues(source, target) {
    if (isNullOrUndefined(source))
      return;

    Object.keys(source).forEach(key => {
      target[key] = source[key];
    });
  }
}
