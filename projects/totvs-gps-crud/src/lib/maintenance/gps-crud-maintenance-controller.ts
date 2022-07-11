import {Params, ActivatedRoute, UrlSegment} from '@angular/router';
import { take } from 'rxjs/operators';

export class GpsCRUDMaintenancePage<T>{

  private _urlSegments:UrlSegment[];

  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly crudObjectType: (new () => T)) {
    activatedRoute.url.pipe(take(1)).subscribe(urlSegments => {
        this._urlSegments = urlSegments;
    });
  }

  get urlSegments() { return this._urlSegments; }

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