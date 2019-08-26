export interface ICacheService {
    get(...key:any): Promise<any>;
}

export interface ICacheModel {
    readonly primaryKeys: string[];
    readonly ENTITY: string;
}
