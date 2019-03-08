import { TotvsGpsDateUtils } from "./totvs-gps-date-utils.component";

/**
 * Classe para manipulação de objetos JSON
 */
export class TotvsGpsJsonUtils {

  constructor() { }

  static getInstance(): TotvsGpsJsonUtils {
    return new TotvsGpsJsonUtils();
  }

  /**
     * Atribui um objeto JSON para um modelo de dados
     * @param target objeto destino da cópia de dados
     * @param source conteúdo do arquivo no formato Blob
     */
  public assign(target: Object, source: Object) {
    let dateUtils = TotvsGpsDateUtils.getInstance();
    // cria uma nova instância do objeto destino para analisar o tipo de cada propriedade
    let referenceObject = new (Object.getPrototypeOf(target).constructor)();
    // faz uma cópia do objeto origem para fazer as conversões de tipo nele
    let newObject = Object.assign({}, source);
    let fieldsSource = Object.keys(newObject);
    let fieldsTarget = Object.keys(referenceObject);
    for (let i in fieldsSource) {
      let field = fieldsSource[i];
      let typeSource: string = (typeof (newObject[field])).toLowerCase();
      if (fieldsTarget.includes(field)) {
        let typeTarget: string = (typeof (referenceObject[field])).toLowerCase();
        if (typeSource != typeTarget) {
          // caso os tipos de dado sejam diferentes, analisar a conversão manualmente
          if (referenceObject[field] instanceof Date) {
            newObject[field] = dateUtils.convertDate(newObject[field]);
          }
          else if (typeTarget == "number") {
            newObject[field] = Number(newObject[field] || 0).valueOf();
          }
          else if (typeTarget == "string") {
            newObject[field] = String(newObject[field] || '').valueOf();
          }
          else if (typeTarget == "boolean") {
            newObject[field] = Boolean(newObject[field] || false).valueOf();
          }
        }
      }
      else {
        // verifica se a propriedade origem é uma data válida
        if ((typeSource == "string") && (dateUtils.isISODate(newObject[field]))) {
          newObject[field] = dateUtils.convertDate(newObject[field]);
        }
      }
    }

    Object.assign(target, newObject);
    return target;
  }

}
