import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { TotvsGpsServices } from 'totvs-gps-services';

@Injectable()
export class GpsCRUDCustomService {

    // private readonly _urlCustom = 'hgp/v1/custom';
    // private readonly _urlCustomGetFields = this._urlCustom + '/{{program}}/{{context}}';
    // private readonly _urlCustomGetValues = this._urlCustom + '/save/{{program}}/{{context}}';
    // private readonly _urlCustomBeforeSave = this._urlCustom + '/before/{{program}}/{{context}}';
    // private readonly _urlCustomSaveFields = this._urlCustom + '/save/{{program}}/{{context}}';

    private parseProgramName(program: string): { program, context } | null {
        let programParams = program.replace('\\', '/').split('/');
        if (programParams.length == 1) {
            return { program: programParams[0], context: 'crud' };
        }
        else if (programParams.length == 2) {
            return { program: programParams[0], context: programParams[1] };
        }
        return;
    }

    convertParamMap(param: ParamMap): any {
        let result = {};
        param?.keys.forEach(k => { result[k] = param.get(k) });
        return result;
    }

    getFields(program: string): Promise<any[]> {
        // TODO - aguardando alteracoes fsw
        // return TotvsGpsServices
        //     .getInstance<any[]>(Object, this._urlCustomGetFields)
        //     .setPathParams(this.parseProgramName(program))
        //     .get();
        return Promise.resolve([]);
    }

    getValues(program: string, data: any): Promise<any[]> {
        // TODO - aguardando alteracoes fsw
        // return TotvsGpsServices
        //     .getInstance<any[]>(Object, this._urlCustomGetValues)
        //     .setPathParams(this.parseProgramName(program))
        //     .post(data);
        return Promise.resolve([]);
    }

    validate(program: string, data: any, values: any): Promise<any> {
        // TODO - aguardando alteracoes fsw
        // return TotvsGpsServices
        //     .getInstance<any>(Object, this._urlCustomBeforeSave)
        //     .setPathParams(this.parseProgramName(program))
        //     .post(data);
        return Promise.resolve();
    }

    save(program: string, data: any, values: any): Promise<any> {
        // TODO - aguardando alteracoes fsw
        // return TotvsGpsServices
        //     .getInstance<any>(Object, this._urlCustomSaveFields)
        //     .setPathParams(this.parseProgramName(program))
        //     .post(data);
        return Promise.resolve();
    }

}