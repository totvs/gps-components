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
  label: string;
  value: string;
  data?: any;
}

/**
 * Interface com retorno dos dados da API de servidores RPW
 */
export interface IRpwServer {
    serverCode: string;
    serverName: string;
}

/**
 * Classe utilizada no componente de RPW
 * Obs: Copiada do TFS
 */
export class TotvsGpsRpw {
    fileNameHidden:boolean = false;
    outputFile:string = '';
    executionTime = '1';
    executionAppointmentDate:Date;
    executionAppointmentHour:string = '';
    executionServer:string = '';
    repeatExecution:boolean = false;
    multisession:boolean = false;
    allowMultipleSessions:boolean = false;
    numberOfSessions:number = 1;

    repeatExecAppointmentDaily:number;
    repeatExecAppointmentHourDaily:string = '';
    
    repeatExecAppointmentMonthly:number;
    repeatExecAppointmentHourMonthly:string = '';
    repeatExecOnLastDayOfMonth: 1 | 2 = 1;
    repeatExecMonthlyDay:number;

    repeatExecFinalDate:Date;

    repeatExecPattern: 1 | 2 = 1; /* 1 - Diario, 2 - Mensal */    

    activeTab:number;

    parseJsonToObject(param){
        Object.assign(this,param);                                        
    }

}

/**
 * Mock model, usado no gps-mock-fill
 */
export interface IModelFillData {
    description: string,
    model: any,
    url: string
}
