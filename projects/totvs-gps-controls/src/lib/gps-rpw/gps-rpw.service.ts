import { Injectable } from '@angular/core';
import { TotvsGpsServices } from 'totvs-gps-services';
import { IRpwServer } from '../totvs-gps-controls.model';

@Injectable()
export class GpsRpwService {

  private readonly _url:string = 'global/v1/rpwServers';
  private readonly _urlUserServer:string = this._url + '/userServer';

  public getServers(): Promise<IRpwServer[]> {
    return TotvsGpsServices.getInstance<IRpwServer[]>(Object, this._url).get();
  }  

  public getUserServerDefault(): Promise<IRpwServer> {
    return TotvsGpsServices.getInstance<IRpwServer>(Object, this._urlUserServer).get();
  }  

}
