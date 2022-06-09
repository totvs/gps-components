export interface ICacheService {
    get(...key:any): Promise<any>;
}

export interface ICacheModel {
    readonly primaryKeys: string[];
    readonly ENTITY: string;
    parseJsonToObject:Function;
    cacheFields?:ICacheFields;
}

export interface ICacheFields{
    code?:string; 
    description?:string;
}
