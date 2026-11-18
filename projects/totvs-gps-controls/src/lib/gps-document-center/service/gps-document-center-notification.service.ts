import { Injectable, NgZone } from '@angular/core';
import { GpsDocument } from '../models/gps-document';
import { GpsDocumentCenterService } from './gps-document-center.service';

/**
 * @description
 * Função chamada quando novos documentos são detectados. Cada aplicação define como alertar o usuário
 * (po-notification, badge, popup, etc).
 */
export type GpsNewDocumentsHandler = (newDocuments: Array<GpsDocument>) => void;

/**
 * @description
 * Verifica periodicamente se há novos documentos na central de documentos do usuário e avisa a aplicação.
 *
 * Exemplo:
 *   notificationService.init(30000, docs => poNotification.information(`${docs.length} novo(s) documento(s)`));
 *   ...
 *   notificationService.cleanup(); // ex.: no ngOnDestroy / logout
 */
@Injectable({ providedIn: 'root' })
export class GpsDocumentCenterNotificationService {

  private timerId: any = null;
  private checking: boolean = false;
  private knownKeys: Set<string> = null;
  private onNewDocuments: GpsNewDocumentsHandler = null;

  constructor(
    private documentService: GpsDocumentCenterService,
    private ngZone: NgZone
  ) { }

  /**
     * @description
     * Inicia o controle: a cada intervalo, consulta os documentos do usuário e compara com os já conhecidos.
     * Se já estiver em execução, reinicia com os novos parâmetros.
     * @param intervalMs Periodicidade da verificação, em milissegundos
     * @param knownDocuments Lista de documentos já conhecidos, que não devem ser considerados novos
     * @param onNewDocuments Função chamada com os documentos novos encontrados
     */
  init(intervalMs: number, knownDocuments: Array<GpsDocument>, onNewDocuments: GpsNewDocumentsHandler): void {
    if (!(intervalMs > 0)) {
      throw new Error('GpsDocumentCenterNotificationService.init: intervalMs deve ser maior que zero.');
    }
    this.cleanup();
    this.setKnownDocuments(knownDocuments);
    this.onNewDocuments = onNewDocuments;

    // O timer roda fora do Angular para não disparar detecção de mudanças a cada tick
    this.ngZone.runOutsideAngular(() => {
      this.timerId = setInterval(() => this.poll(), intervalMs);
    });
  }

  /**
     * @description
     * Armazena a lista de documentos já existentes. Documentos fora dessa lista serão considerados novos.
     * Caso não seja chamado, a primeira verificação do timer apenas registra a lista inicial, sem alertar.
     */
  setKnownDocuments(documents: Array<GpsDocument>): void {
    this.knownKeys = new Set((documents ?? []).map(doc => this.getKey(doc)));
  }

  /**
     * @description
     * Compara a lista recebida com a lista conhecida e alerta a aplicação sobre os documentos novos.
     * A lista conhecida passa a ser a lista recebida.
     * @returns Documentos novos encontrados
     */
  checkNewDocuments(documents: Array<GpsDocument>): Array<GpsDocument> {
    const current = documents ?? [];
    const newDocuments = this.knownKeys ? current.filter(doc => !this.knownKeys.has(this.getKey(doc))) : [];

    this.setKnownDocuments(current);

    if (newDocuments.length > 0 && this.onNewDocuments) {
      // Volta para a zona do Angular para que a aplicação atualize a tela ao ser notificada
      this.ngZone.run(() => this.onNewDocuments(newDocuments));
    }
    return newDocuments;
  }

  /**
     * @description
     * Para o timer e libera a lista de documentos e o callback da memória
     */
  cleanup(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.checking = false;
    this.knownKeys = null;
    this.onNewDocuments = null;
  }

  private poll(): void {
    // Evita requisições sobrepostas caso o backend demore mais que o intervalo
    if (this.checking) {
      return;
    }
    this.checking = true;

    this.documentService.listDocuments()
      .then(documents => {
        if (this.timerId !== null) {
          this.checkNewDocuments(documents);
        }
      })
      .catch(() => { /* falha pontual: tenta novamente na próxima verificação */ })
      .finally(() => this.checking = false);
  }

  private getKey(document: GpsDocument): string {
    return `${document.fullPath}|${document.date?.getTime() ?? ''}`;
  }
}
