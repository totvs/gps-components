import type { TTalkCollection } from "totvs-gps-services"
import { GpsQuestion } from "totvs-gps-crud"
import { PoDialogService } from "@po-ui/ng-components";
import { Injectable } from "@angular/core";

@Injectable()
export class TotvsQuestionUtils{

    constructor(private dialogService:PoDialogService){
    }

    public validateInsert(service:IQuestionUtils, data):Promise<boolean>{
        return this.callValidateFunction(service.validateInsert.bind(service), data);
    }

    public validateUpdate(service:IQuestionUtils, data):Promise<boolean>{
        return this.callValidateFunction(service.validateUpdate.bind(service), data);
    }

    public validateRemove(service:IQuestionUtils, data):Promise<boolean>{        
        return this.callValidateFunction(service.validateRemove.bind(service), data);
    }

    private async callValidateFunction(serviceFunction, data){
        let _messages:TTalkCollection<GpsQuestion>
        let _isConfirm = true;
        _messages = await serviceFunction(data);
        for (const message of _messages.items) {
            _isConfirm = await this.showDialog(message);
            if(!_isConfirm){
                return false;
            }
        }
        return true;
    }

    private showDialog(message:GpsQuestion): Promise<boolean>{
       return new Promise((resolve, reject) =>{
            try {
                this.dialogService.confirm({
                    'title': 'Atenção',
                    'message': message.descriptionFormatted,
                    confirm: () =>{ resolve(true) },
                    cancel: () =>{ resolve(false) }
                })   
            } catch (error) {
                reject(error);
            }        
      });
    }

}

export interface IQuestionUtils{
  validateInsert(data:any):Promise<TTalkCollection<GpsQuestion>>;
  validateUpdate(data:any):Promise<TTalkCollection<GpsQuestion>>;
  validateRemove(data:any):Promise<TTalkCollection<GpsQuestion>>;
}
