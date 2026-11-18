import { Injectable } from '@angular/core';
import { GpsDocument } from '../models/gps-document';
import { TotvsGpsServices } from 'totvs-gps-services';
import { DocumentList } from '../models/document-list';

@Injectable({ providedIn: 'root' })
export class GpsDocumentCenterService {

  private readonly baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/totvs-menu/rest`;
  private readonly documentsUrl = `${this.baseUrl}/documents/action/`;
  private readonly downloadUrl = '/totvs-menu/rest/documents/download/?path=';  

  /**
     * @description
     * Lista os arquivos do usuário na central de documentos
     * @param url URl base para o endpoint da tela
     * @param headers Objeto HTTPClient.options enviado na requisição (ex: { headers: HttpHeaders })
     */
  getDocuments(filter: any): Promise<DocumentList> {
    return TotvsGpsServices
      .getInstance<DocumentList>(DocumentList)
      .post(filter, this.documentsUrl);
  }

  /**
     * @description
     * Lista os arquivos do usuário na raiz da central de documentos, já convertidos para o modelo GpsDocument
     */
  listDocuments(): Promise<Array<GpsDocument>> {
    return this.getDocuments({ action: 'list', path: '/' })
      .then(list => (list?.result ?? []).map(item => new GpsDocument().parseJsonToObject(item)));
  }

  /**
     * @description
     * Retorna a URL para download de um arquivo da central de documentos
     * @param fullPath Caminho completo do arquivo a ser baixado
     */
  getDownloadUrl(fullPath: string): string {
    return this.downloadUrl + encodeURIComponent(fullPath);
  }
}
