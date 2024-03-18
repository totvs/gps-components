import { Injectable } from "@angular/core";
import { TotvsGpsServices } from "./totvs-gps-services.component";
import { TotvsFileUtils } from "totvs-gps-utils";



type SmartViewFile = {
    fileName:string,
    fileByte:number[],
    contentType:string
}

@Injectable()
export class TotvsGpsSmartViewService{

    private _apiUrl:string = `${location.protocol}//${location.host}/api/trep/generate`;            

    public generate(layoutName:string, format:string=TotvsGpsSmartViewFormats.PDF, parameters:Object, attachment:boolean=false){        
        const token = this.getToken();
        const headers = new Headers({"Authorization": `Bearer ${token}`});

        const promise = TotvsGpsServices
            .getInstance<any>(Object)
            .setQueryParams({layoutName, format, attachment})            
            .post(this.proccessParams(parameters), this._apiUrl, {headers})

        if(attachment == false){
            return promise.then((res:SmartViewFile) => this.proccessFile(res));
        }
        return promise;
    }

    private proccessFile(file:SmartViewFile){                        
        var base64 = btoa(String.fromCharCode(...new Uint8Array(file.fileByte)));        
        const blb = TotvsFileUtils.base64ToArray(base64);
        return TotvsFileUtils.getInstance().downloadFile(file.fileName, blb);
    }

    public getToken(){
        const datasulToken:Object = JSON.parse(localStorage?.getItem("token-service.token"));
        if(datasulToken){
            return datasulToken["access_token"] ?? "";            
        }
            
        return "";
    }

    private proccessParams(params:Object):Object{
        const newObj = new Object();        
        for (const key of Object.keys(params)) {
            newObj[key] = [params[key]];
        }
        return newObj;
    }

}

export enum TotvsGpsSmartViewFormats{
    PDF = "pdf",
    CSV = "csv",
    XLS = 'xls',
    XLSX = 'xlsx',
    RTF = 'rft',
    DOCX = 'docx',
    MNT = 'mht',
    HTML = 'html',
    TXT = 'txt',
    JPEG = 'jpeg',
    PNG = 'png'
}