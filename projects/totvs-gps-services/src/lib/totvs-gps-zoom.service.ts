import { IZoomColumn, FilterValue, GenericZoomEntity, GenericZoomOption } from "./totvs-gps-zoom.model";
import { Observable, from } from "rxjs";
import { TTalkCollection } from "./totvs-gps-services.model";
import { isNull } from "totvs-gps-utils";
import { TotvsGpsServices } from "./totvs-gps-services.component";
import { generateKeyPath, getLookupColumns, getObjectFieldLabel, getObjectFieldValue, getFieldsList, getODataFilter } from "./totvs-gps-services.utils";

export interface IZoomService {
  COLUMNS: Array<IZoomColumn>;
  FIELD_LABEL: string;
  FIELD_VALUE: string;
  getFilteredItems(params:any): Observable<TTalkCollection<any>>;
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

    if(this._url.substring(this._url.length - 1) != "/")
      this._url = this._url + "/";
  }

  public setZoomTable(zoomTable) {
    this._zoomTable = zoomTable;
  }

  public buildObjectByFilter(searchObject?: any, pageNumber?: number, pageSize?: number, objectPosition?: number, additionalQuery?: string, fields?: string[], expand?: string[]): Promise<TTalkCollectionZoom<T>> {
    let params: any = {};
    if (!isNull(this._zoomTable)) {
      params.ZOOM_TABLE = this._zoomTable;
    }
    if ((!isNull(objectPosition)) && (objectPosition > 0)) {
      params.OBJECT_POSITION = objectPosition;
    }
    if ((!isNull(additionalQuery)) && (additionalQuery.trim().length > 0)) {
      params.ADDITIONAL_QUERY = additionalQuery;
    }
    if (!isNull(searchObject)) {
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
    if (!isNull(object['$filter'])) {
      url += 'id/';
      Object.assign(params, object);
    }
    // caso tenha enviado filtro completo
    else {
      url += generateKeyPath(object);
      service.setPathParams(object);
    }

    if (!isNull(this._zoomTable)) {
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

    if (!isNull(this.genericZoomEntity.apiUrl))
      this.service.setUrl(this.genericZoomEntity.apiUrl);
    else
      this.service.setUrl(this.genericUrl);

    if (!isNull(this.genericZoomEntity.zoomTable))
      this.service.setZoomTable(this.genericZoomEntity.zoomTable);

    this.FIELD_LABEL = this.fieldLabel();
    this.FIELD_VALUE = this.fieldValue();
  }

  private createColumns() {
    this.COLUMNS = [];
    if (isNull(this.genericZoomEntity.columnDefinition))
      getLookupColumns(this.genericZoomEntity).forEach(column => this.COLUMNS.push(column));
    else this.genericZoomEntity.columnDefinition.forEach(column => this.COLUMNS.push(column));
  }

  private fieldLabel(): any {
    if (isNull(this.genericZoomEntity.fieldLabel)) {
      return getObjectFieldLabel(this.genericZoomEntity).toString();
    }
    else {
      return this.genericZoomEntity.fieldLabel;
    }
  }
  private fieldValue(): any {
    if (isNull(this.genericZoomEntity.fieldValue)) {
      return getObjectFieldValue(this.genericZoomEntity).toString();
    }
    else {
      return this.genericZoomEntity.fieldValue;
    }
  }

  public getFilteredItems(params:any): Observable<any> {
    return this.getFilteredData(params.filter, params.page, params.pageSize);
  }

  public getFilteredData(filter: string, page: number, pageSize: number, filterParams?: any): Observable<any> {

    let genericZoomOption: GenericZoomOption = new GenericZoomOption();
    let additionalQuery: string = "";

    if (!isNull(filter) && (filter.length > 0)) {
    let sf = new FilterValue("search", filter);
      genericZoomOption.filters.push(sf);
      genericZoomOption.filter = filter;
    }
    genericZoomOption.filterParams = filterParams;

    if (page === 1)
      this.objectPosition = 0;

    if (!isNull(genericZoomOption.filterParams)) {
      this.prepareToFilter(genericZoomOption, this.genericZoomEntity);
      if (!isNull(genericZoomOption.filterParams["additionalQuery"]))
        additionalQuery = genericZoomOption.filterParams["additionalQuery"];
    }

    if (!isNull(genericZoomOption.fields)) {
      if (!isNull(genericZoomOption.filters)) {
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
      if (!isNull(result)
        && !isNull(result.position))
        this.objectPosition = result.position;
    });

    return from(this.selectedObject);
  }

  public getObjectByValue(value: string, filterParams?: any): Observable<any> {

    let temporaryObject = new Object();
    let result;
    let genericZoomOption: GenericZoomOption = new GenericZoomOption();

    genericZoomOption.filterParams = filterParams;
    if(isNull(genericZoomOption.filterParams)){
      this.copyObjectValues(this.genericZoomEntity,temporaryObject);
      this.genericZoomEntity.setZoomByIdProperty(value);
    }

    if (!isNull(genericZoomOption.filterParams)) {
      this.copyObjectValues(filterParams, temporaryObject);
      if (!isNull(genericZoomOption.filterParams["setZoomByIdProperty"]))
        genericZoomOption.filterParams.setZoomByIdProperty(value);

      //if (!isNull(genericZoomOption.filterParams["additionalQuery"]))
      //  additionalQuery = genericZoomOption.filterParams["additionalQuery"];

      this.prepareToFilter(genericZoomOption, this.genericZoomEntity);

      //byvalue does not need object position
      genericZoomOption.objectPosition = 0;

      let filterObject = Object.create(genericZoomOption.filterParams);
      filterObject.setZoomByIdProperty(value);

      if (!isNull(genericZoomOption.oDataFilter) && !isNull(genericZoomOption.oDataFilter['$filter'])) {
        result = this.service.getObjectById(
          genericZoomOption.oDataFilter,
          genericZoomOption.fields,
          genericZoomOption.filters);
        if(!isNull(filterParams)) {
          this.copyObjectValues(temporaryObject, filterParams);
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

    result = this.service.getObjectById(this.genericZoomEntity);

    if(!isNull(genericZoomOption.filterParams)){
    this.copyObjectValues(temporaryObject, filterParams);
    }

    if(isNull(genericZoomOption.filterParams)){
        this.copyObjectValues(temporaryObject,this.genericZoomEntity,);
    }

    return result;
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

    if ((!isNull(genericZoomOption.fields)) && (genericZoomOption.fields.length > 0)) {
      genericZoomOption.oDataFilter = getODataFilter(genericZoomOption.filterParams, genericZoomOption.filter, genericZoomEntity);

      if (!isNull(genericZoomOption.oDataFilter)
        && !isNull(genericZoomOption.oDataFilter['$filter']))
        genericZoomOption.filters = null;
    }

    if (!isNull(this.objectPosition)
      && this.objectPosition > 0)
      genericZoomOption.objectPosition = this.objectPosition;

    return genericZoomOption;
  }

  public copyObjectValues(source, target) {
    if (isNull(source))
      return;

    Object.keys(source).forEach(key => {
      target[key] = source[key];
    });
  }
}
