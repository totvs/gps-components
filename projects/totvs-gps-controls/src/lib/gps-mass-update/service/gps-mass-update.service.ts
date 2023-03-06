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
     */
  exportEmpty(url): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post({}, url + '/mass/export/empty');
  }

  /**
     * @description
     * Exportar layout com dados da base de acordo com filtro enviado
     * @param filter Objeto com os filtros aplicados
     * @param url URl base para o endpoint da tela
     */
  exportByFilter(filter, url): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(filter, url + '/mass/export');
  }

  /**
     * @description
     * Enviar arquivo selecionado para pré visualização
     * @param file Arquivo selecionado
     * @param url URl base para o endpoint da tela
     */
  massExecuteCheck(file, url): Promise<any> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(file, url + '/mass/execute/check');
  }

  /**
     * @description
     * Enviar items a importar
     * @param items Items selecionados para importação
     * @param url URl base para o endpoint da tela
     */
  massExecute(items, url): Promise<Export> {
    return TotvsGpsServices
      .getInstance<Export>(Export)
      .post(items, url + '/mass/execute');
  }
}
