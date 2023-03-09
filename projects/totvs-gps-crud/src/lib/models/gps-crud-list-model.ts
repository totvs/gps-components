import {PoPageAction, PoTableColumn} from '@po-ui/ng-components';

export class GpsCRUDListModel<T>{

  public title:string = '';  
  public advancedFilterTitle:string = "Filtrar busca";
  public tableMessage: string = 'Utilize os campos de filtro para pesquisar';
  public listItems: Array<T> = new Array<T>();  
  public listColumns:PoTableColumn[];
    
  public actions: PoPageAction[] = [
    { label: 'Adicionar', url: '/new' }
  ];

  /**
   * Método que atualiza a referência da lista de objetos.
   * Alteração necessária para satisfazer as versões mais novas (> 15) do PO-UI
   * onde o po-table só é atualizado quando há alteração na referência do Array.
   */
   public updateListItemsReference() {
    this.listItems = [...this.listItems];
  }
}
