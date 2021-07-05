import { isNull } from "./functions";

export class GpsMaintenanceUrl {

    private static prepareUrl(url:string){
        let _url:string = '';

        if(!isNull(url))
            _url = url;
        
        if(!_url.endsWith("/"))
            _url = _url + "/";

        return _url;
    }

    static getUrl(crudObject:any,url?:string):string{
        let maintenanceKey:string = this.getObjectPrimaryKeysUrl(crudObject);

        url = this.prepareUrl(url);
        url = url + maintenanceKey;    

        return url;
    }

    static getNavigationUrl(crudObject:any,url?:string):string{
        let maintenanceUrl:string = this.getObjectPrimaryKeysUrlValue(crudObject);

        url = this.prepareUrl(url);
        url = url + maintenanceUrl;        

        return url;
    }

    static getObjectPrimaryKeysUrl(object:any):string{
        let objectPrimaryKeysUrl:string = '';
        object.primaryKeys.forEach(field => {
            if(objectPrimaryKeysUrl.length > 0)
                objectPrimaryKeysUrl  = objectPrimaryKeysUrl + "/";
            objectPrimaryKeysUrl = objectPrimaryKeysUrl + "{{" + field + "}}";
        });

        return objectPrimaryKeysUrl;
    }

    static getObjectPrimaryKeysUrlValue(object:any):string{
        let objectPrimaryKeysUrl:string = '';
        object.primaryKeys.forEach(field => {
            if(objectPrimaryKeysUrl.length > 0)
                objectPrimaryKeysUrl  = objectPrimaryKeysUrl + "/";
            objectPrimaryKeysUrl = objectPrimaryKeysUrl + object[field];
        });

        return objectPrimaryKeysUrl;
    }

    static getPathParamsObject(object:any):any{
        let pathParamObject = {};
        object.primaryKeys.forEach(primaryKey => {
            pathParamObject[primaryKey] = object[primaryKey]
        });
        return pathParamObject;
    }
}