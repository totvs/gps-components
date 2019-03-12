import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let ttalkRegexp: RegExp = new RegExp(/^[\w\d]+\/v[\d\.]+\//i);

    let newRequest: HttpRequest<any>;
    // Trata requisições de endereço completo
    if (request.url.startsWith('http')) {
      newRequest = request.clone({ url: request.url });
    }
    else {
      // remove a barra a esquerda, se tiver, para padronizar a requisição
      let _url = request.url;
      if (_url.startsWith('/'))
        _url = _url.substring(1);
      // Trata requisição de api t-talk
      if (ttalkRegexp.test(_url)) {
        newRequest = request.clone({ url: TotvsGpsInterceptorService.URL_TTALK + _url });
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
      return next.handle(newRequest);
    else {
      return next.handle(newRequest).pipe(
        catchError(error => {
          // trata retorno do timeout de sessao
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

}
