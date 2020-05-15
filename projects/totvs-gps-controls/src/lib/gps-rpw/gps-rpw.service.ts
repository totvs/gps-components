import { Injectable } from '@angular/core';
import { TotvsGpsServices } from 'totvs-gps-services';
import { IRpwServer } from '../totvs-gps-controls.model';

@Injectable()
export class GpsRpwService {

  private readonly _url:string = 'global/v1/rpwServers';

  public getServers(): Promise<IRpwServer[]> {
    return TotvsGpsServices.getInstance<IRpwServer[]>(Object, this._url).get();
  }  

}
