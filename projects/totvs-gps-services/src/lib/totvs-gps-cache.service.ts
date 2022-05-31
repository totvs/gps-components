import { Injectable } from '@angular/core';
import { ICacheService, ICacheModel } from './totvs-gps-cache.model';
import { ICacheList, ICacheParams, ICacheValue } from './totvs-gps-cache.internal-model';
import { isNull } from 'totvs-gps-utils';

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

    public getPromise<T>(model: ICacheModel, expand?:string[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.get(model, ((value) => {
                if(Object.keys(value).length === 0){
                    reject(undefined);
                }
                resolve(value);
            }), expand);
        });        
    }    

    

    public get(model: ICacheModel, callback?:Function, expand?:string[]): any {
        if (isNull(model)) {
            if (!isNull(callback))
                callback(null);
            return null;
        }
        let modelName = model.ENTITY;
        // Verifica se existe lista para o model, senao cria uma
        let cacheList = this._list[modelName];
        if (isNull(cacheList)) {
            this._list[modelName] = { values: [] };
            cacheList = this._list[modelName];
        }
        let pk = model.primaryKeys;
        let params:ICacheParams = {};
        params.params = pk.map(item => String(model[item] || ''));
        
        //Caso informado algum expandable, adicionar o mesmo nos params após os campos da pk
        if(expand){
            params.expand = expand;
        }

        let index = [modelName,...params.params].join(';');
        // se valor ja existe, usa o da lista
        let value: ICacheValue = (cacheList.values.find(item => item.index == index));
        if (!isNull(value)) {
            if (!isNull(callback)) {
                // se tiver função de callback, e a informação já está pronta, chama o callback
                if (value.ready)
                    callback(value.data);
                // senao, adiciona na lista para ser chamado posteriormente
                else
                    value.onReady.push((v:ICacheValue) => { callback(v.data) });
            }
            return value.data;
        }
        // se nao existe, pesquisa
        let service: ICacheService = this._services[modelName];
        if (isNull(service)) {
            if (!isNull(callback))
                callback(null);
            return null;
        }
        value = { index: index, data: new Object(), ready: false, onReady: [] };
        if (!isNull(callback))
            value.onReady.push((v:ICacheValue) => { callback(v.data) });
        cacheList.values.push(value);
        service.get(...params.params, params.expand)
            .then(result => {
                Object.assign(value.data, result);
                this.callOnReady(value);
            });
        return value.data;
    }

    private callOnReady(value: ICacheValue) {
        value.ready = true;
        value.onReady.forEach(f => f(value));
        value.onReady = [];
    }

  
}
