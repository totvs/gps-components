import { Component, Input, ViewChild } from "@angular/core";
import { PoModalComponent, PoModalAction, PoNotificationService } from "@po-ui/ng-components";
import { TotvsGpsRpw } from "../totvs-gps-controls.model";

@Component({
  selector: 'gps-export-data-backend',
  templateUrl: './gps-export-data-backend.component.html',
  styleUrls: ['./gps-export-data-backend.component.css']
})
export class GpsExportDataBackendComponent {
    @ViewChild('modal', {static:true}) modal: PoModalComponent;
    @Input('gps-service') gpsService: IExportDataService;
    @Input('gps-filter') gpsFilter: any = {};
    public rpw: TotvsGpsRpw = new TotvsGpsRpw();
    public isShowLoading: boolean = false;
    
    confirmAction: PoModalAction = {
        label: 'Exportar',
        action: () => { this.doExport() }
    }

    cancelAction: PoModalAction = {
        label: 'Cancelar',
        action: () => { this.closeModal(); }
    }

    constructor(
        private notificationService: PoNotificationService
    ) {
    };

    public export(pageTitle: string) {
        this.rpw.outputFile = this.removeSpecialChar(`Relatorio ${pageTitle.toLowerCase()}`);
        if(this.validateService()){
            this.modal.open();
        }
    }

    private closeModal() {
        this.modal.close();
    }

    private doExport() {

        if(this.validateService()){
            this.showLoading();
            this.gpsService.exportData(this.gpsFilter, this.rpw).then((result) => {
                this.notificationService.success(`Pedido ${result.processNumber} realizado com sucesso.`);                
            })
            .finally(() => {                    
                this.hideLoading(); 
                this.closeModal();
            });
        }
    }

    private validateService(): boolean {
        if (!this.gpsService) {
            this.notificationService.error('O serviço de exportação de dados não foi informado.');
            return false;
        }

        if(this.gpsService.exportData == undefined){
            this.notificationService.error('O serviço de exportação de dados não implementa o método exportData.');
            return false;
        }

        return true;
    }


    showLoading() {
        this.isShowLoading = true;
    }
    hideLoading() {
        this.isShowLoading = false;
    }

    removeSpecialChar(fileName: string): string {
        const normalized = fileName.normalize('NFD'); // Remove acentos
        const noAccents = normalized.replace(/[\u0300-\u036f]/g, ''); // Remove diacríticos
        const noSpecialChars = noAccents.replace(/[^a-zA-Z0-9.\s_-]/g, ''); // Remove caracteres especiais, exceto alguns permitidos
        return noSpecialChars.replace(/\s+/g, ' ').trim(); // Substitui múltiplos espaços por um único
    }

}

export interface IExportDataService{
    exportData(filter: any, rpw: TotvsGpsRpw): Promise<{processNumber:number}>;
}