/**
 * Classe para manipulação de objetos de data
 */

export class TotvsGpsDateUtils {

  constructor() { }

  static getInstance(): TotvsGpsDateUtils {
    return new TotvsGpsDateUtils();
  }

  private readonly ISO8601_DATE_REGEX: RegExp =
    /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
  private readonly DATE_REGEX: RegExp =
    /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

  /**
   * Milissegundos contidos em um dia
   */
  public static ONE_DAY = (1000 * 3600 * 24);

  /**
   * Converte o valor para uma data
   * @param value Valor da data a ser convertida
   */
  public convertDate(value): Date {
    let result: Date;
    if (value != null) {
      if (typeof (value) == 'string') {
        //Armazena o ano antes da conversão para Data para tratar anos < 100
        let year = this.getYearFromStringDate(value);

        result = new Date(value);
        // valida necessidade de conversão do TimeZone
        let timezoneOffset = (new Date()).getTimezoneOffset();

        let dateParts = value.split('T');
        if (dateParts.length == 2) {
          let timePart = dateParts[1];
          // se inclui o timezone, não considera o timezone local na conversão
          if (timePart.includes('-') || timePart.includes('+')) {
            timezoneOffset = 0;
          }
        }
        else {
          // converte para data UTC, pois essa forma ja desconsidera o TZ
          let utcDate: Date = new Date(result.getUTCFullYear(), result.getUTCMonth(), result.getUTCDate());
          result = new Date(utcDate);
          timezoneOffset = 0;
        }
        if (timezoneOffset != 0) {
          result = new Date(result.getTime() + (timezoneOffset * 60000));
        }
        if(year > 0) {
          result.setFullYear(year);
        }
        return result;
      }
      return new Date(value);
    }
    return;
  }

  /* Extrai o ano de uma data no formato string
    * Quando a data é do tipo string ela pode vir em dois formatos:
    * 1) Wed Dec 28 2005 00:00:00 GMT-0300 (GMT-03:00)
    * 2) 2022-03-24
    */
  private getYearFromStringDate(value: string): number {
    let yearParts = value.split(" ");
    if(yearParts.length == 7) {
      return parseInt(yearParts[3]);
    } else {
      yearParts = value.split("-");
      if(yearParts.length == 3) {
        return parseInt(yearParts[0]);
      }
    }
    return 0;
  }

  /**
   * Formata a saída de uma data para o formato local (ex: DD/MM/AAAA)
   * @param value Data a ser formatada
   */
  public getLocaleDate(value: Date): string {
    if (value == undefined) {
      return '';
    }
    // THF trata a data como string no formato ISO-8601, por isso é necessário testar qual o tipo
    let d: Date;
    if (value instanceof Date)
      d = value;
    else
      d = this.convertDate(value);
    //
    if (d != undefined)
      return d.toLocaleDateString();
    return '';
  }

  /**
   * Retorna a diferença de dias entre as duas datas, desconsiderando o horário
   * @param initialDate Data inicial
   * @param finalDate Data final
   * @returns Numero de dias entre as duas datas
   */
  public daysBetween(initialDate: Date, finalDate: Date): number {
    return Math.floor((finalDate.getTime() - initialDate.getTime()) / TotvsGpsDateUtils.ONE_DAY);
  }

  /**
   * Retorna se o parametro de entrada é uma data no formato ISO (YYYY-MM-DD)
   * @param value String a ser verificada
   */
  public isISODate(value: string): boolean {
    return this.DATE_REGEX.test(value);
    /*let v = this.ISO8601_DATE_REGEX.exec(value);
    if (v) {
      // testa se o ano é >= 1900
      let i = Number.parseInt(v[1]);
      if (i < 1900)
        return false;
      // testa se o mês é valido
      i = Number.parseInt(v[2]);
      if ((i < 1)||(i > 12))
        return false;
      // testa se o dia é valido
      i = Number.parseInt(v[3]);
      if ((i < 1)||(i > 31))
        return false;
      return true;
    }
    return false;*/
  }

}
