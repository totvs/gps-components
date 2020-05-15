import 'reflect-metadata';
import { TotvsMaskString } from "totvs-gps-utils";
import { isNullOrUndefined } from "util";
import { IZoomColumn, GenericZoomEntity } from "./totvs-gps-zoom.model";

export const PROGRESS_FIELD = "ProgressField";
export const LOOKUP_COLUMN = "LookUpColumn";
export const PROGRESS_ID = "ProgressId";
export const LOOKUP_FIELD_VALUE = "LookUpFieldValue";
export const LOOKUP_FIELD_LABEL = "LookUpFieldLabel";

export function encodeURLParam(data: any): string {
    if (!isNullOrUndefined(data)) {
        if (data instanceof Boolean || typeof(data) === "boolean") {
            return data.toString();
        }
        if (data instanceof Date) {
            return [
                TotvsMaskString.getInstance('0000', {reverse:true}).apply(data.getFullYear().toString()),
                TotvsMaskString.getInstance('00', {reverse:true}).apply((data.getMonth()+1).toString()),
                TotvsMaskString.getInstance('00', {reverse:true}).apply(data.getDate().toString())
            ].join('-');
        }
        return encodeURIComponent(data);
    }
    return '';
}

export function generateKeyPath(obj:any): string {
    if ((!isNullOrUndefined(obj))&&(Array.isArray(obj.primaryKeys))) {
        let values: string[] = [];
        obj.primaryKeys.forEach(key => { values.push('{{' + key + '}}') });
        return [...values,''].join('/');
    }
    return '';
}

export function getObjectFieldLabel<T>(instance:T):string{
    let returnValue:string = "";

    Object.keys(instance).forEach((key) => {
        let value = getLookUpFieldLabel(instance,key);
        if(!isNullOrUndefined(value)
        && value == true){
            let a2 = getProgressFieldValue(instance,key).toString();
            returnValue = a2;
        }
    });

    return returnValue.toString();
}

export function getObjectFieldValue<T>(instance:T): string {
    let returnValue:string = "";

    Object.keys(instance).forEach((key) => {
        let value = getLookUpFieldValue(instance,key);
        if((!isNullOrUndefined(value))&&(value == true))
            returnValue = getProgressFieldValue(instance,key).toString();
    });

    return returnValue;
}

export function getLookupColumns<T>(instance:T): IZoomColumn[] {
    let columnList: IZoomColumn[] = [];
    
    Object.keys(instance).forEach((key) => {
        let columnName = getProgressFieldValue(instance,key);
        let labelValue = getLookUpColumnValue(instance,key);
        if ((!isNullOrUndefined(columnName))&&(!isNullOrUndefined(labelValue)))
            columnList.push(<IZoomColumn> { property: columnName, label: labelValue});
    });

    return columnList;
}

export function getFieldsList<T>(instance:T): string[] {
    let fieldsList:string[] = [];
    
    Object.keys(instance).forEach((key) => {
        let field = getProgressFieldValue(instance,key);
        if(!isNullOrUndefined(field))
            fieldsList.push(field);
    });

    return fieldsList;
}

export function getODataFilter<T>(instance:T,filter:string,genericZoomEntity:GenericZoomEntity): object {

    let oDataFilter:String = '';
    let oDataViewFilter:String = '';
    let searchAggregator:string = '';
    let viewSearchAggregator:string = '';

    for (let index = 0; index <  Object.keys(instance).length; index++) {

        let key = Object.keys(instance)[index];

        let propertyKey = getProgressFieldValue(instance,key);
        let isColumn    = getLookUpColumnValue(instance,key);

        if((isNullOrUndefined(isColumn) || !isColumn) 
        && !isNullOrUndefined(genericZoomEntity.columnDefinition))
            isColumn = hasColumnField(propertyKey,genericZoomEntity);
        
        if((!isNullOrUndefined(isColumn) && isColumn)
        && !isNullOrUndefined(propertyKey)
        && !isNullOrUndefined(instance[key])
        && isValidValue(filter)
        && !isValidValue(instance[key])
        && canAssignValue(filter,instance[key])){

            oDataViewFilter = oDataViewFilter.concat(viewSearchAggregator.toString()).concat(propertyKey);

            oDataViewFilter = addValueToODataFilter(oDataViewFilter,genericZoomEntity[key],filter);
            
            searchAggregator = " and ";
            viewSearchAggregator = " or ";
        }

        //apenas cria filtros para valores validos
        if(!isNullOrUndefined(instance[key])         
        && !isNullOrUndefined(propertyKey)
        && isValidValue(instance[key])){
            oDataFilter = oDataFilter.concat(searchAggregator.toString()); // + propertyKey + ' eq ' + instance[key];

            oDataFilter = oDataFilter.concat(propertyKey);

            oDataFilter = addValueToODataFilter(oDataFilter,genericZoomEntity[key],instance[key]);

            searchAggregator = " and ";
        }
        
       oDataViewFilter.concat(oDataViewFilter.toString());
    }

    if(oDataFilter.length > 0
    || oDataViewFilter.length > 0){
        if(oDataViewFilter.length > 0){
            if(oDataFilter.length > 0 )
                oDataFilter = oDataFilter.concat(" and ( " + oDataViewFilter.toString() + " ) ");
            else  oDataFilter = oDataFilter.concat(oDataViewFilter.toString());
        }
    }

    return {"$filter": oDataFilter.toString()};
}

export function addValueToODataFilter(oDataFilter:String,object,value):String{

    if(object instanceof String
    || typeof object === "string"
    || object instanceof Date){
        oDataFilter = oDataFilter + ' bg ' + "'" + value + "'";
    }else{ 
        oDataFilter = oDataFilter + ' eq ' + value;
    }

    return oDataFilter;
}

function getProgressFieldValue<T>(instance: T, propertyKey: string) {
    let result = Reflect.getMetadata(PROGRESS_FIELD,instance, propertyKey)
    return result;  
}

function getLookUpColumnValue<T>(instance: T, propertyKey: string) {
    let result = Reflect.getMetadata(LOOKUP_COLUMN,instance, propertyKey)
    return result;  
}

function getLookUpFieldValue<T>(instance: T, propertyKey: string) {
    let result = !!Reflect.getMetadata(LOOKUP_FIELD_VALUE,instance, propertyKey)
    return result;  
}

function getLookUpFieldLabel<T>(instance: T, propertyKey: string) {
    let result = !!Reflect.getMetadata(LOOKUP_FIELD_LABEL,instance, propertyKey)
    return result;  
}

function hasColumnField(propertyKey: string,genericZoomEntity:GenericZoomEntity): boolean {
    for (let index = 0; index < genericZoomEntity.columnDefinition.length; index++) {
        let element:IZoomColumn = genericZoomEntity.columnDefinition[index];
        if(element.property == propertyKey)
            return true;
    }

    return false;
}

export function isValidValue(object): boolean{
    if(isNullOrUndefined(object))
        return false;

    if (((object instanceof String)||(typeof object === "string")) && (object !== ""))
        return true;

    if(object instanceof Date)
        return true;

    if((object instanceof Number || typeof object === "number") && (object !== 0))
        return true;

    return false;
}

function canAssignValue(value,property): boolean{

    let onlyNumbers:boolean = false;

    if(isNullOrUndefined(value))
        return false;
   
    if(!isNaN(Number(value))){
        onlyNumbers = true;
    }

    if((property instanceof String)||(typeof property === "string"))
        return true;

    if(((property instanceof Number)||(typeof property === "number"))&&(onlyNumbers))
        return true;

    return false;
}