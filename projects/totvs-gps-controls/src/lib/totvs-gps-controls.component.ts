import { FormGroup } from '@angular/forms';
import { TotvsGpsInvalidField, TotvsGpsFieldValidation } from './totvs-gps-controls.model';

export class TotvsGpsControls {

  constructor() { }

  static getInstance(): TotvsGpsControls {
    return new TotvsGpsControls();
  }

  /**
   * Faz a validação do form e retorna quais campos são inválidos
   * @param formGroup Referencia do elemento <form #f="ngForm">
   * @param document Referencia do elemento document
   * @param mark Flag que indica se deve marcar os campos como Dirty e Touched
   * @param manualValidation Validações manuais para campos específicos. O método receberá o FormControl do campo, e deve retornar um boolean informando se o campo é válido ou não
   * @returns Retorna a lista de campos inválidos
   */
  public validateForm(formGroup: FormGroup, document: Document, mark?:boolean, manualValidation?: TotvsGpsFieldValidation[]): TotvsGpsInvalidField[] {
    let invalidFields: TotvsGpsInvalidField[] = [];
    Object.keys(formGroup.controls).forEach(field => {
      let control = formGroup.controls[field];      

      // Verifica se o controle é um FormGroup para validar os "filhos" dele
      if (control instanceof FormGroup) {
        invalidFields.push(...this.validateForm(control, document, mark));
      }
      else {
        // control.disabled nao esta funcionando com elementos do thf
        let disabled = false;
        let element = document.querySelector('input[name="'+field+'"]');
        if (!element)
          element = document.querySelector('textarea[name="'+field+'"]');
        if (!element)
          element = document.querySelector('[name="'+field+'"]');

        if (element)
          disabled = (element.querySelector(':disabled') != null) || (element.hasAttribute("disabled"));

        if (!disabled) {
            // valida se deve marcar ou nao os campos (borda vermelha)
            if (mark === true) {
              control.markAsDirty();
              control.markAsTouched();
            }
            // valida campos manualmente para os casos que fogem do padrão
            if (manualValidation) {
              let manual = manualValidation.find(item => item.fieldName == field);
              if (manual) {
                manual.validation(control);
              }
            }
            
            if (control.invalid) {  
              invalidFields.push(<TotvsGpsInvalidField>{
                fieldName: field,
                element: element,
                control: control
              });
            }
        }
        else {
          // se campo esta desabilitado, remove marcação
          control.markAsUntouched();
          control.markAsPristine();
        }
      }
    });
   
    return invalidFields;
  }
  
}
