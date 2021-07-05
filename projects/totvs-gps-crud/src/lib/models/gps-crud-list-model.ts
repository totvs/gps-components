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

}
