import { Component, Input, OnInit } from '@angular/core';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { GpsDocument } from './models/gps-document';
import { GpsDocumentCenterService } from './service/gps-document-center.service';
import { GpsDocumentCenterNotificationService } from './service/gps-document-center-notification.service';

@Component({
    selector: 'gps-document-center',
    templateUrl: './gps-document-center.component.html',
    styleUrls: ['./gps-document-center.component.css'],
    standalone: false
})
export class GpsDocumentCenterComponent implements OnInit {

  @Input('gps-title') title: string = 'Meus Documentos';
  @Input('gps-subtitle') subtitle: string = '';

  items: Array<GpsDocument> = [];
  isLoading: boolean = false;
  loadingMessage: string = 'Carregando...';

  columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome do arquivo' },
    { property: 'date', label: 'Data', type: 'dateTime', format: 'dd/MM/yyyy, HH:mm:ss', width: '250px' },
    { property: 'typeLabel', label: 'Tipo', width: '150px' },
    { property: 'sizeLabel', label: 'Tamanho', width: '150px' },
    { property: '$actions', label: 'Ações', type: 'icon', width: '100px', icons: [
      {
        value: 'download',
        icon: 'po-icon-download',
        tooltip: 'Download',
        disabled: this.isDownloadDisabled.bind(this),
        action: this.onDownload.bind(this)
      }
    ]}
  ];

  constructor(
    private service: GpsDocumentCenterService,
    private notificationService: GpsDocumentCenterNotificationService
  ) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.isLoading = true;
    this.loadingMessage = 'Carregando...';
    this.service.listDocuments()
      .then(items => {
        this.items = items;
        this.notificationService.setKnownDocuments(items);
      })
      .finally(() => this.isLoading = false);
  }

  private isDownloadDisabled(row: GpsDocument) {
    return !row.isFile;
  }

  onDownload(document: GpsDocument) {
    try {
      this.isLoading = true;
      this.loadingMessage = 'Baixando arquivo...';
      
      window.open(this.service.getDownloadUrl(document.fullPath), '_blank');
    } finally {
      this.isLoading = false;
    }
  }
}
