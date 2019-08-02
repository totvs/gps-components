import { PROGRESS_FIELD, LOOKUP_COLUMN, PROGRESS_ID, LOOKUP_FIELD_VALUE, LOOKUP_FIELD_LABEL } from "./totvs-gps-services.utils";

export function ProgressField(progressKey: string) {
  return Reflect.metadata(PROGRESS_FIELD, progressKey);
}

export function LookUpColumn(progressKey: string) {
  return Reflect.metadata(LOOKUP_COLUMN, progressKey);
}

export function ProgressId(value?) {
  return Reflect.metadata(PROGRESS_ID, value);
}

export function LookUpFieldValue() {
  return Reflect.metadata(LOOKUP_FIELD_VALUE, true);
}

export function LookUpFieldLabel() {
  return Reflect.metadata(LOOKUP_FIELD_LABEL, true);
}

export interface IZoomColumn {
  fieldLabel?: boolean;
  format?: string;
  label?: string;
  property?: string;
  type?: string;
  width?: string;
}

export interface IGenericEntity {
  primaryKeys: string[];
}

export interface IGenericZoomEntity {
  readonly zoomTable?: string;
  readonly fieldLabel?: string;
  readonly fieldValue?: string;
  readonly columnDefinition?: IZoomColumn[];
  readonly apiUrl?: string;
  getZoomFieldFormat?;
  setZoomByIdProperty;
  toFilterValue?;
  additionalQuery?;
}



export class GenericEntity implements IGenericEntity {
  public primaryKeys: string[];
}

export class FilterValue {
  property: string;
  filterValue: string;

  constructor(property?: string, filterValue?: string) {
    this.property = property || '';
    this.filterValue = filterValue || '';
  }

  public toQueryParam() {
    return this.property + "=" + this.filterValue;
  }
}

export class GenericZoomEntity extends GenericEntity implements IGenericZoomEntity {
  zoomTable?: string;
  fieldLabel?: string;
  fieldValue?: string;
  columnDefinition?: any;
  getZoomFieldFormat?: any;
  apiUrl?: string = '';
  setZoomByIdProperty;
  toFilterValue?;
  additionalQuery?;
}

export class GenericZoomOption {
  filter: string;
  filterParams: any;
  filters: FilterValue[];
  fields: string[];
  oDataFilter: any;
  objectPosition: number;

  constructor() {
    this.filters = [];
    this.fields = [];
    this.oDataFilter = null;
  }
}
