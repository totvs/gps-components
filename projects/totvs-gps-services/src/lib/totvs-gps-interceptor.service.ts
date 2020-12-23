import { Injectable, isDevMode } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isNull } from 'totvs-gps-utils';

@Injectable()
export class TotvsGpsInterceptorService implements HttpInterceptor {

  /**
   * URL base para chamadas de API
   */
  static URL_TTALK: string = '/dts/datasul-rest/resources/prg/';
  /**
   * URL base para fachadas (métodos antigos)
   */
  static URL_FACADE: string = '/dts/datasul-rest/resources/api/fch/fchsau/thf/';
  /**
   * Verificar se expirou a sessão e recarrega a página (window.location.reload) caso necessário
   */
  static JOSSO_SESSION_RELOAD: boolean = false;
  /**
   * Desabilita tratamento automatico da URL para produto TOTVS
   */
  static DISABLE_URL_PATTERN: boolean = false;
  /**
   * URL para servidor de mock de dados
   * @example 'http://localhost:8080'
   */
  static MOCK_SERVER: string = '';
  /**
   * URL do contexto padrao datasul
   */
  private readonly URL_DATASUL = '/dts';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let ttalkRegexp: RegExp = new RegExp(/^[\w\d]+\/v[\d\.]+\//i);
    let ttalkRelativePath: string = '';

    let newRequest: HttpRequest<any>;
    // Trata requisições de endereço completo
    if (request.url.startsWith('http') || request.url.startsWith(this.URL_DATASUL) || TotvsGpsInterceptorService.DISABLE_URL_PATTERN) {
      newRequest = request.clone({ url: request.url });
    }
    else {
      // remove a barra a esquerda, se tiver, para padronizar a requisição
      let _url = request.url;
      if (_url.startsWith('/'))
        _url = _url.substring(1);
      // Trata requisição de api t-talk
      if (ttalkRegexp.test(_url)) {
        ttalkRelativePath = _url;
        newRequest = request.clone({ url: TotvsGpsInterceptorService.URL_TTALK + ttalkRelativePath });
      }
      // Trata requisições de fachadas (antigas)
      else {
        newRequest = request.clone({ 
          url: TotvsGpsInterceptorService.URL_FACADE + _url, 
          headers: request.headers.set('ReturnFormatVersion', '2') 
        });
      }
    }

    if (!TotvsGpsInterceptorService.JOSSO_SESSION_RELOAD)
      return next.handle(newRequest).pipe(
        catchError(error => {
          // tratamento para redirecionar para servidor de mock
          if (error instanceof HttpErrorResponse) {
            if ((ttalkRelativePath!='')&&(this.shouldRedirecToMockServer(error))) {
              let _server = TotvsGpsInterceptorService.MOCK_SERVER;
              if (!_server.endsWith('/'))
                _server += '/';
              newRequest = request.clone({ url: _server + ttalkRelativePath });
              return next.handle(newRequest);
            }
          }
          throw error;
        })
      );
    else {
      return next.handle(newRequest).pipe(
        catchError(error => {
          // trata retorno do timeout de sessao do JOSSO
          if (error instanceof HttpErrorResponse) {
            if (error.status == 200) {
              if (error.url.indexOf('josso_security_check') > 0) {
                window.location.reload();
              }
            }
          }
          throw error;
        })
      );
    }
  }

  private shouldRedirecToMockServer(error: HttpErrorResponse) {
    if (isDevMode()&&!isNull(TotvsGpsInterceptorService.MOCK_SERVER)&&(TotvsGpsInterceptorService.MOCK_SERVER!='')) {
      if ((error.status >= 400)&&(JSON.stringify(error).indexOf('not found')>0)) {
        // 500 - {"message":"Internal server error","detailedMessage":"ERROR condition: ** \"hvp/api/v1/XYZ\" was not found. (293) (7211)","code":"INTERNAL_SERVER_ERROR"}
        // 400 - {"code":"BAD_REQUEST", "message":"Bad request", "detailedMessage":"Method not found"}
        return true;
      }
    }
    return false;
  }

}
