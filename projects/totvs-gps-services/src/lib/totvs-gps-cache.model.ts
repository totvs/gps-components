export interface ICacheService {
    get(...key:any): Promise<any>;
}

export interface ICacheModel {
    readonly primaryKeys: string[];
    readonly ENTITY: string;
}

export interface ICacheValue {
    index: string;
    data?: any;
}

export interface ICacheList {
    values: ICacheValue[];
}
