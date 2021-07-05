import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TotvsGpsMockRequest } from './totvs-gps-mock-request.component';
import { isNull } from 'totvs-gps-utils';

@Injectable({
  providedIn: 'root'
})
export class TotvsGpsDataService {

  private _httpClient: HttpClient;
  private _mockRequests: { url:string, request:TotvsGpsMockRequest }[] = [];
  private _mockInProductionMode: boolean = false;

  constructor(private httpClient: HttpClient) {
    this._httpClient = this.httpClient;
  }

  public get HttpClient() { 
    return this._httpClient;
  }

  public enableMockInProductionMode() {
    this._mockInProductionMode = true;
  }

  public clearMockRequests() {
    this._mockRequests = [];
  }

  public addMockRequest(url:string,mockRequest:TotvsGpsMockRequest) {
    this._mockRequests.push({ url: url, request: mockRequest });
  }

  public getMockRequest(url:string): TotvsGpsMockRequest {
    if (isDevMode() || this._mockInProductionMode) {
      let result = this._mockRequests.find(r => url.startsWith(r.url));
      if (!isNull(result))
      return result.request;
    }
    return;
  }
  
}
