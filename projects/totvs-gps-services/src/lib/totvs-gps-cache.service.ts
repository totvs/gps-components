import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ICacheService, ICacheModel } from './totvs-gps-cache.model';
import { ICacheList, ICacheValue } from './totvs-gps-cache.internal-model';

@Injectable()
export class TotvsGpsCacheService {

    private _services: ICacheService[] = [];
    private _list: ICacheList[] = [];

    public clearServices() {
        this._services = [];
        this._list = [];
    }
    
    public addService(model: ICacheModel, service: ICacheService) {
        this._services[model.ENTITY] = service;
    }

    public get(model: ICacheModel, callback?:Function): any {
        if (isNullOrUndefined(model)) {
            if (!isNullOrUndefined(callback))
                callback(null);
            return null;
        }
        let modelName = model.ENTITY;
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
        if (!isNullOrUndefined(value)) {
            if (!isNullOrUndefined(callback))
                callback(value.data);
            return value.data;
        }
        // se nao existe, pesquisa
        let service: ICacheService = this._services[modelName];
        if (isNullOrUndefined(service)) {
            if (!isNullOrUndefined(callback))
                callback(null);
            return null;
        }
        value = { index: index, data: new Object() };
        cacheList.values.push(value);
        service.get(...params)
            .then(result => {
                Object.assign(value.data, result);
                if (!isNullOrUndefined(callback))
                    callback(value.data);
            });
        return value.data;
    }

  
}
