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
 * Interface para identificar a implementação da coleção de dados padrão T-Talk
 */
export interface TTalkCollection<T> {
  hasNext: boolean;
  items: Array<T>;
}
