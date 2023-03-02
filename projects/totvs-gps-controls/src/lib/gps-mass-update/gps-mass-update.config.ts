import { PoPageAction } from "@po-ui/ng-components";
import { GpsPageNavigation } from "totvs-gps-crud";

/**
 * @description
 * Classe de configurações padrão do gps-mass-update a ser utilizada nas telas que implementarem o componente
 * 
 * @param pageNavigation instância do pageNavigation
 */
export class GpsMassUpdateConfig {

    /**
     * @description
     * Rota padrão para a tela de atualização em massa
     */
    static routePathDefault: string = 'massUpdate'

    /**
     * @description
     * Ação padrão a ser adicionada nas ações da tela
     */
    actionDefault: PoPageAction = { label: 'Atualização em massa', action: this.onMassUpdate.bind(this) }
    
    constructor(private pageNavigation: GpsPageNavigation){}

    private onMassUpdate() {
        this.pageNavigation.navigate('massUpdate');
    }

}