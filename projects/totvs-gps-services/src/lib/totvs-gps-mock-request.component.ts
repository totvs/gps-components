import { IServiceRequest, HTTPMethod } from "./totvs-gps-services.model";
import { Observable, of } from "rxjs";
import { isNullOrUndefined } from "util";

export class TotvsGpsMockRequest implements IServiceRequest {

    private _requests: { method: HTTPMethod, url:RegExp, response:any }[] = [];

    clearMockResults() {
        this._requests = [];
    }

    addMockResult(httpMethod:HTTPMethod, urlPattern:RegExp, response?:any) {
        this._requests.push({ method: httpMethod, url: urlPattern, response: response });
    }

    get(url:string): Observable<Object> {
        return this.mockResponse(HTTPMethod.GET, url);
    }

    post(url:string, data:Object): Observable<Object> {
        return this.mockResponse(HTTPMethod.POST, url);
    }

    put(url:string, data:Object): Observable<Object> {
        return this.mockResponse(HTTPMethod.PUT, url);
    }

    delete(url:string): Observable<Object> {
        return this.mockResponse(HTTPMethod.DELETE, url);
    }

    private mockResponse(httpMethod:HTTPMethod,url:string): Observable<Object> {
        let response = this.findResponse(httpMethod,url);
        console.log('MOCK', httpMethod, `URL=${url}`, response);
        return of(response);
    }

    private findResponse(httpMethod:HTTPMethod,url:string): any {
        let result = this._requests.filter(r => r.method == httpMethod).find(r => r.url.test(url));
        if (!isNullOrUndefined(result))
            return result.response;
        return;
    }

}
