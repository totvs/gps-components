import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ICacheService, ICacheList, ICacheModel, ICacheValue } from './totvs-gps-cache.model';

@Injectable()
export class TotvsGpsCacheService {

    private _services: ICacheService[] = [];
    private _list: ICacheList[] = [];

    public clearServices() {
        this._services = [];
        this._list = [];
    }
    
    public addService(modelType: {new():Object}, service: ICacheService) {
        let modelName: string = Object(modelType).name;
        this._services[modelName] = service;
    }

    public get(model: ICacheModel): any {
        if (isNullOrUndefined(model))
            return null;
        let modelName = Object(model).constructor.name;
        // Verifica se existe lista para o model, senao cria uma
        let cacheList = this._list[modelName];
        if (isNullOrUndefined(cacheList)) {
            this._list[modelName] = { values: [] };
            cacheList = this._list[modelName];
        }
        let pk = model.primaryKeys;
        let params = pk.map(item => String(model[item] || ''));
        let index = [modelName,...params].join(';');
        // se valor ja existe, usa o da lista
        let value: ICacheValue = (cacheList.values.find(item => item.index == index));
        if (!isNullOrUndefined(value))
            return value.data;
        // se nao existe, pesquisa
        let service: ICacheService = this._services[modelName];
        if (isNullOrUndefined(service))
            return null;
        value = { index: index, data: new Object() };
        cacheList.values.push(value);
        service.get(...params)
            .then(result => Object.assign(value.data, result));
        return value.data;
    }

  
}
