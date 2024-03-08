import { Injectable } from '@angular/core';
import { TotvsGpsServices } from 'totvs-gps-services';
import { Export } from '../models/export';

@Injectable({
  providedIn: 'root'
})
export class GpsMassUpdateService {  

  /**
     * @description
     * Exportar layout sem dados
     * @param url URl base para o endpoint da tela
     * @param headers Objeto headers enviado no header da requisição
     */
  exportEmpty(url, headers?:Object): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post({}, url + '/mass/export/empty', headers);
  }

  /**
     * @description
     * Exportar layout com dados da base de acordo com filtro enviado
     * @param filter Objeto com os filtros aplicados
     * @param url URl base para o endpoint da tela
     * @param headers Objeto headers enviado no header da requisição
     */
  exportByFilter(filter, url, headers?:Object): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(filter, url + '/mass/export', headers);
  }

  /**
     * @description
     * Enviar arquivo selecionado para pré visualização
     * @param file Arquivo selecionado
     * @param url URl base para o endpoint da tela
     * @param headers Objeto headers enviado no header da requisição
     */
  massExecuteCheck(file, url, headers?:Object): Promise<any> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(file, url + '/mass/execute/check', headers);
  }

  /**
     * @description
     * Enviar items a importar
     * @param items Items selecionados para importação
     * @param url URl base para o endpoint da tela
     * @param headers Objeto headers enviado no header da requisição
     */
  massExecute(items, url, headers?:Object): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(items, url + '/mass/execute', headers);
  }
}
