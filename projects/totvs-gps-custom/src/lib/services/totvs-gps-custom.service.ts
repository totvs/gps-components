import { Injectable } from '@angular/core';
import { TotvsGpsServices, TTalkCollection } from 'totvs-gps-services';
import { UrlSegment, ActivatedRoute } from '@angular/router';
import { TotvsGpsDynamicForm } from '../models/totvs-gps-dynamic-form';
import { TotvsGpsCustomMenu } from '../models/totvs-gps-custom-menu';
import { TotvsGpsCustomColumn } from '../models/totvs-gps-custom-column';
import { CustomAction, PageAction, TotvsGpsCustomAction } from '../models/totvs-gps-custom-action';

@Injectable()
export class TotvsGpsCustomService {
 
    private readonly _url:string = "hgp/v1/customFields/";
    private readonly _urlMenu:string = this._url + 'menu/';
    private readonly _urlOtherActions:string = 'otherActions/';
    private readonly _urlCustomJson:string = 'customJson/';
    private readonly _urlColumns:string = 'columns/';
    private readonly _urlSearchData:string = 'searchData/';
    private readonly _urlChangeValues:string = 'changeValues/';
    private readonly _urlParameters:string = '{{menu}}/{{programName}}/';  

    public getCustomFields(params:UrlSegment[], menu:string, programName:string):Promise<TotvsGpsDynamicForm>{
        return TotvsGpsServices
          .getInstance<TotvsGpsDynamicForm>(TotvsGpsDynamicForm, this.generateParameters(params,this._url))
          .setPathParams({menu: menu, programName: programName, params: params})
          .get();
    }  

    public save(value:Object, params:UrlSegment[], menu:string, programName:string):Promise<any>{
        return TotvsGpsServices
          .getInstance<any>(Object, this.generateParameters(params,this._url))
          .setPathParams({menu: menu, programName: programName, params: params})
          .post(value);
    }

    public remove(params:any[], menu:string, programName:string):Promise<any>{
        return TotvsGpsServices
          .getInstance<any>(Object, this.generateParametersRemove(params,this._url))
          .setPathParams({menu: menu, programName: programName, params: params})
          .delete();
    }

    public validateSave(value:Object, params:UrlSegment[], menu:string, programName:string):Promise<any>{
        return TotvsGpsServices
          .getInstance<any>(Object, this.generateParameters(params,this._url))
          .setPathParams({menu: menu, programName: programName, params: params})
          .put(value);

    }
    public getCustomColumns(tableColumns:Array<any>, menu:string, programName:string){
        return TotvsGpsServices
            .getInstance<TotvsGpsCustomColumn>(TotvsGpsCustomColumn,  this._url + this._urlParameters +  this._urlColumns)
            .setPathParams({menu: menu, programName: programName})
            .get()
            .then((data:any) => {
                    data.columns.forEach(column => {
                        tableColumns.push(column);
                    });
                });
    }
    
    public getCustomMenus(params:UrlSegment[], menu:string, programName:string): Promise<TTalkCollection<TotvsGpsCustomMenu>> {
        return TotvsGpsServices
          .getInstance<TotvsGpsCustomMenu>(TotvsGpsCustomMenu, this.generateParameters(params,this._urlMenu))
          .setPathParams({menu: menu, programName: programName, params: params})
          .getCollection();
    }
 
    public getCustomJson(params:any[], menu:string, programName:string): Promise<TTalkCollection<any>> {
      return TotvsGpsServices
      .getInstance<any>(Object, this.generateParametersAction(params,this._urlCustomJson,this._url))
      .setPathParams({menu: menu, programName: programName, params: params})
      .getCollection();
    }

    public updateCustomJson(value:Object,params:any[], menu:string, programName:string): Promise<TTalkCollection<any>> {
      return TotvsGpsServices
      .getInstance<any>(Object, this.generateParametersAction(params,this._urlCustomJson,this._url)) 
      .setPathParams({menu: menu, programName: programName, params: params})
      .post(value);
    }

    public getCustomOtherActions(params:UrlSegment[], pageActions:Array<any>, menu:string, programName:string): Promise<Array<PageAction>>{
        return TotvsGpsServices
          .getInstance<TotvsGpsCustomAction>(TotvsGpsCustomAction, this.generateParametersAction(params, this._urlOtherActions,this._url))
          .setPathParams({menu: menu, programName: programName, params: params})
          .get()
          .then((data:any) => {
              this.createCustomAction(pageActions, data);
              return pageActions;
          });
    }

    public searchData(value:Object,params:UrlSegment[], menu:string, programName:string): Promise<any>{
      return TotvsGpsServices
      .getInstance<any>(Object, (this.generateParameters(params,this._url) + this._urlSearchData))
      .setPathParams({menu: menu, programName: programName, params: params})
      .post(value);
  }

    public createCustomAction(newPageActions:Array<PageAction>, data:any) {
        // trecho para limpar possiveis ações custom que já estavam na página
        for (let index = 0; index < newPageActions.length; index++) {
            const pageAction = newPageActions[index];
            if (pageAction.action.toString().indexOf("customNavigate") > 0){
                newPageActions.splice(newPageActions.indexOf(pageAction),1);
            }
        }

        // adicionar as novas ações custom que vieram do backend
        if (data.actions != undefined) {
          for (let index = 0; index < data.actions.length; index++) {
              const customAction:CustomAction = data.actions[index];
                let pageAction:PageAction = {label: customAction.label, 
                                          action: () => {this.customNavigate(customAction.url)}, 
                                             icon: customAction.icon};
                newPageActions.push(pageAction);
          }
        }
    }
 
    public customNavigate(url:string){
        window.top.location.href = window.parent.location.pathname + '#' + window.parent.location.pathname + url;
    }

    private generateParameters(params:UrlSegment[],targetUrl:string):string{
        var paramsUrl = targetUrl + this._urlParameters;
        params.forEach(param => {
        if (param.path != '') {
            paramsUrl = paramsUrl + param.path + "/";
        }
        });
        return paramsUrl;
    }

    private generateParametersRemove(params:any[],targetUrl:string):string{
        var paramsUrl = targetUrl + this._urlParameters;
        params.forEach(param => {
            paramsUrl = paramsUrl + param + "/";
        });
        return paramsUrl;
    }

    private generateParametersAction(params:UrlSegment[],targetActionUrl:string,targetUrl:string):string{
        var paramsUrl = targetUrl + this._urlParameters;
        params.forEach(param => {
            paramsUrl = paramsUrl + param.path + "/";
        });
		paramsUrl = paramsUrl + targetActionUrl;
        return paramsUrl;
    }

    public changeValues(value:Object,params:UrlSegment[], menu:string, programName:string): Promise<any>{
      return TotvsGpsServices
      .getInstance<any>(Object, (this.generateParameters(params,this._url) + this._urlChangeValues))
      .setPathParams({menu: menu, programName: programName, params: params})
      .post(value);
    }

}
