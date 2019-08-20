export interface ICacheService {
    get(...key:any): Promise<any>;
}

export interface ICacheModel {
    primaryKeys: string[];
}

export interface ICacheValue {
    index: string;
    data?: any;
}

export interface ICacheList {
    values: ICacheValue[];
}
