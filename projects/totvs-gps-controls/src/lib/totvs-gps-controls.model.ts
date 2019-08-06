import { AbstractControl } from "@angular/forms";

/**
 * Interface que corresponde aos campos incorretos em tela
 */
export interface TotvsGpsInvalidField {
  fieldName: string;
  element: Element;
  control: AbstractControl;
}

/**
 * Interface que corresponde a validações manuais dos campos
 */
export interface TotvsGpsFieldValidation {
  fieldName: string;
  validation: Function;
}

/**
 * Interface para a lista de itens do component <gps-order-list>
 */
export interface IOrderListItem {
  order?: number;
  value: string;
  label: string;
  data?: any;
}
