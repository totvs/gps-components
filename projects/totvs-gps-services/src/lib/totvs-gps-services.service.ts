import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TotvsGpsServicesService {

  private _httpClient: HttpClient;

  constructor(private httpClient: HttpClient) {
    this._httpClient = this.httpClient;
  }

  public get HttpClient() { 
    return this._httpClient;
  }
  
}
