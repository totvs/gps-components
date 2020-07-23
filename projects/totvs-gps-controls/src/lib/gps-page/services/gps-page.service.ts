import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { TotvsGpsServices } from 'totvs-gps-services';

@Injectable()
export class GpsPageService {

    private readonly _urlCustom = 'hgp/v1/custom';
    private readonly _urlCustomGetFields = this._urlCustom + '/{{program}}/{{context}}';
    private readonly _urlCustomGetValues = this._urlCustom + '/{{program}}/{{context}}';
    private readonly _urlCustomBeforeSave = this._urlCustom + '/before/{{program}}/{{context}}';
    private readonly _urlCustomSaveFields = this._urlCustom + '/save/{{program}}/{{context}}';
    
    private parseProgramName(program:string): { program,context } | null {
        let programParams = program.replace('\\','/').split('/');
        if (programParams.length == 1) {
            return { program: programParams[0], context: 'crud' };
        }
        else if (programParams.length == 2) {
            return { program: programParams[0], context: programParams[1] };
        }
        return;
    }

    convertParamMap(param:ParamMap): any {
        let result = {};
        param?.keys.forEach(k => { result[k] = param.get(k) });
        return result;
    }

    getCustomFields(program:string): Promise<any[]> {
        return TotvsGpsServices
            .getInstance<any[]>(Object, this._urlCustomGetFields)
            .setPathParams(this.parseProgramName(program))
            .get();
    }

    getCustomFieldValues(program:string,key:any): Promise<any[]> {
        return TotvsGpsServices
            .getInstance<any[]>(Object, this._urlCustomGetValues)
            .setPathParams(this.parseProgramName(program))
            .post({ key: key });
    }

    beforeSaveCustomFields(program:string,key:any,values:any): Promise<any> {
        return TotvsGpsServices
            .getInstance<any>(Object, this._urlCustomBeforeSave)
            .setPathParams(this.parseProgramName(program))
            .post({ key: key, values: values });
    }

    saveCustomFields(program:string,key:any,values:any): Promise<any> {
        return TotvsGpsServices
            .getInstance<any>(Object, this._urlCustomSaveFields)
            .setPathParams(this.parseProgramName(program))
            .post({ key: key, values: values });
    }

}