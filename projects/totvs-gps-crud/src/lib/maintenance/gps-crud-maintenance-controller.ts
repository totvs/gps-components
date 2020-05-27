import {Params, ActivatedRoute} from '@angular/router';

export class GpsCRUDMaintenancePage<T>{

  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly crudObjectType: (new () => T)) {
  }

  public getObjectFromRouteParams():Promise<T>{
    return new Promise(resolve => {
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (Object.keys(params).length == 0)
            resolve(null);
          
          let object:T = this.createInstance();
          object = Object.assign(object, params);
          resolve(object);
        }
      );
    }); 
  }

  private createInstance(): T { return new this.crudObjectType(); }

}