import { isNullOrUndefined } from "util";
import { IDisclaimerConfig } from "totvs-gps-controls";

export class GpsPageFilter<T>{

    private _listHasNext:boolean = false;
    private _listPage:number = 1;
    public listSize:number;
    public filter = this.createAdvancedFilterInstance();
    public fields:Array<string>;
    public expand:Array<string>
    public disclaimerConfig:IDisclaimerConfig[] = [];

    get listPage():number{
        return this._listPage;
    }

    get listHasNext():Boolean{
        return this._listHasNext;
    }

    public nextPage(){
        this._listPage = this._listPage + 1;
    }

    public resetPage(){
        this._listPage = 1;
        this._listHasNext = false;
    }

    public resumeSearch(result){
        this._listHasNext = result.hasNext;
    }

    restoreAdvancedFilterDefaults() {
        Object.keys(this.filter).forEach(k => 
            { 
                if(isNullOrUndefined(this.filter[k])) 
                    delete this.filter[k]
            }
        );
        
        let _filter = Object.assign(this.createAdvancedFilterInstance(), this.filter);
        Object.assign(this.filter, _filter);
    }

    public createAdvancedFilterInstance() { 
        return {
            filter: <T>{  }
        }.filter;
    }

    public setFilterText(text){
        this.filter = this.createAdvancedFilterInstance();

        if ((text || '').length > 0)
            this.filter["q"] = text;
    }
}

export interface IAdvancedFilter {
    q?:string;
}