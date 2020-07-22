export interface ILoadingData {
    active:boolean;
    message?:string;
}

export interface ICustomFields {
    fields?:any[];
    values?:any;
}

export declare type GpsPageAction = () => Promise<any> | any;