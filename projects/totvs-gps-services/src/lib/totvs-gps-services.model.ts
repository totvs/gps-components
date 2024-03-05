import { Observable } from "rxjs";

/**
 * Objeto interno para instanciar a classe determinada
 */
export class TotvsGpsObjectModel<T> {
  public type;
  constructor(type: (new () => T))  { this.type = type;  }
  public createInstance(): T { return new this.type(); }
}

/**
 * Interface para identificar a implementação do método de conversão de JSON para a classe específica
 */
export interface ITotvsGpsJsonParse<T> {
  parseJsonToObject(data:any): T;
}

/**
 * Dados para requisições HTTP
 */
export interface IServiceRequest {
  get(url:string, options?:Object): Observable<Object>;
  post(url:string, data:Object, options?:Object): Observable<Object>;
  put(url:string, data:Object, options?:Object): Observable<Object>;
  delete(url:string, options?:Object): Observable<Object>;
}

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * Interface para identificar a implementação da coleção de dados padrão T-Talk
 */
export interface TTalkCollection<T> {
  hasNext: boolean;
  items: Array<T>;
}

export enum OrderSort {
  ASCENDING = 'asc',
  DESCENDING = 'desc'
}
export class OrderField {
  fieldName: string;
  order: OrderSort;

  public static create(fieldName: string, order?: OrderSort): OrderField {
    let result: OrderField = new OrderField();
    result.fieldName = fieldName;
    result.order = (order ? order : OrderSort.ASCENDING);
    return result;
  }
}
