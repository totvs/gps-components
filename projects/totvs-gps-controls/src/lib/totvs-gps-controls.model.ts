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
 * Interface que corresponde a vlaidações manuais dos campos
 */
export interface TotvsGpsFieldValidation {
  fieldName: string;
  validation: Function;
}
