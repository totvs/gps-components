import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { TotvsGpsServices } from 'totvs-gps-services';
import { ICustomFields } from '../gps-page/gps-page.internal-model';

@Injectable()
export class GpsCRUDCustomService {

    private readonly _urlCustom = 'hgp/v1/customFields/{{program}}/{{context}}';

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

    private getUrl(keys: any): string {
        let url = this._urlCustom.split('/');
        let pathKeys = Object.values(keys);
        return [...url,...pathKeys].join('/');
    }

    convertParamMap(param: ParamMap): any {
        let result = {};
        param?.keys.forEach(k => { result[k] = param.get(k) });
        return result;
    }

    getFields(program: string, keys: any): Promise<ICustomFields> {
        return TotvsGpsServices
            .getInstance<ICustomFields>(Object, this.getUrl(keys))
            .setPathParams(this.parseProgramName(program))
            .get();
    }

    validate(program: string, keys: any, formValues: any, customValues: any): Promise<any> {
        return TotvsGpsServices
            .getInstance<any>(Object, this.getUrl(keys))
            .setPathParams(this.parseProgramName(program))
            .put(Object.assign({},customValues,{$data:formValues}));
    }

    save(program: string, keys: any, formValues: any, customValues: any): Promise<any> {
        return TotvsGpsServices
            .getInstance<any>(Object, this.getUrl(keys))
            .setPathParams(this.parseProgramName(program))
            .post(Object.assign({},customValues,{$data:formValues}));
    }

    delete(program: string, keys: any): Promise<any> {
        return TotvsGpsServices
            .getInstance<any>(Object, this.getUrl(keys))
            .setPathParams(this.parseProgramName(program))
            .delete();
    }

}