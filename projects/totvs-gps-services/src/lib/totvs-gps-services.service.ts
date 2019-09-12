import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TotvsGpsMockRequest } from './totvs-gps-mock-request.component';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TotvsGpsDataService {

  private _httpClient: HttpClient;
  private _mockRequests: { url:string, request:TotvsGpsMockRequest }[] = [];

  constructor(private httpClient: HttpClient) {
    this._httpClient = this.httpClient;
  }

  public get HttpClient() { 
    return this._httpClient;
  }

  public clearMockRequests() {
    this._mockRequests = [];
  }

  public addMockRequest(url:string,mockRequest:TotvsGpsMockRequest) {
    this._mockRequests.push({ url: url, request: mockRequest });
  }

  public getMockRequest(url:string): TotvsGpsMockRequest {
    let result = this._mockRequests.find(r => url.startsWith(r.url));
    if (!isNullOrUndefined(result))
      return result.request;
    return;
  }
  
}
