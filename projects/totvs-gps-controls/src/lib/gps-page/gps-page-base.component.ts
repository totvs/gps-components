import { TotvsGpsCustomService, TotvsGpsDynamicForm } from "totvs-gps-custom";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { ICRUDService } from "./models/gps-page.model";

enum PermissionServiceOption {
    CREATE = "create",
    DELETE = "delete",
    DETAIL = "detail",
    UPDATE = "update",
    MASSUPDATE = "massUpdate",
}
  
export class GpsPageBaseComponent {

    //#region Permissões do usuário
    protected _permissions: { [key in PermissionServiceOption]?: boolean } = {};

    /**
     * Obtém as permissões de acesso do usuário (create, edit, detail, delete e massUpdate).
     */
    public initPermissions(route: ActivatedRoute) {
        route.data.subscribe(data => {
            this._permissions = data.permission;
        }).unsubscribe();
    }
    
    /**
     * Verifica se o usuário possui determinada permissão.
     * @param option - (create, edit, detail, delete e massUpdate).
     * @returns true ou false
     */
    public hasPermission(option: PermissionServiceOption) {
        return this._permissions[option] || false;
    }
    //#endregion

    //#region Custom fields
    hasCustomFields = false;
    customFields: TotvsGpsDynamicForm;    

    protected _customService: TotvsGpsCustomService;
    protected _appName: string = '';
    protected _otherAction: string = '';
    protected _detail: string = '';
    protected _edit: string = '';
    protected _editValidate: string = '';
    protected _editSave: string = '';
    protected _urlSegments: UrlSegment[];
    protected _crudService: ICRUDService<any>;    

    /**
     * @description Método que realiza a alteração de um registro na base de dados. Utiliza o serviçe informado na chamada ao método setupCustomFields.
     * Este processo já realiza a chamada à validação dos campos customizáveis do cliente, caso possua.
     * @param model Instância do objeto a ser persistido.
     */
    public update(model: Object): Promise<any> {
        return this.process(false, model);
    }

    /**
     * @description Método que realiza a inclusão de um registro na base de dados. Utiliza o serviçe informado na chamada ao método setupCustomFields.
     * Este processo já realiza a chamada à validação dos campos customizáveis do cliente, caso possua.
     * @param model Instância do objeto a ser persistido.
     */
    public insert(model: Object): Promise<any> {
        return this.process(true, model);
    }

    /**
     * @description Realiza a chamada ao programa responsável por salvar os campos customizáveis do cliente. O programa é carregado através da chamada
     * ao método setupCustomFields.
     * @param model Instância do objeto que contém os campos customizáveis que serão salvos.
     */
    public saveCustom(model: Object): Promise<any> {
        if (!this.hasCustomFields) {
            return Promise.resolve();
        } else {
            return this._customService.save(Object.assign(this.customFields.values, model),this._urlSegments, this._appName, this._editSave);
        }
    }

    /**
     * @description Realiza a validação dos campos customizáveis do cliente, caso possua, e persiste o registro do produto padrão na 
     * base de dados.
     * @param isNew true se é inclusão de registro. false se é alteração de registro
     * @param model Instância do objeto a ser persistido
     */
    private process(isNew: boolean, model: Object): Promise<any> {
        return this.validateCustom(model).then(ok => {
            if(ok) {
                return this.save(isNew, model);
            } else {
                return Promise.reject();
            }
        });
    }

    /**
     * @description Chama o método de insert ou update do service informado na chamada ao método setupCustomFields.
     * @param isNew true se é inclusão de registro. false se é alteração de registro
     * @param model Instância do objeto a ser persistido
     */
    private save(isNew: boolean, model: Object): Promise<any> {
        return isNew ? this._crudService.insert(model) : this._crudService.update(model);
    }

    /**
     * @description Realiza a validação dos campos customizáveis do cliente. O programa de validação é carregado através da chamada
     * ao método setupCustomFields.
     * @param model Instância do model que contém os campos customizáveis do cliente.
     */
    private validateCustom(model: Object): Promise<boolean> {
        if (this.hasCustomFields){
          return this._customService.validateSave(Object.assign(this.customFields.values, model), this._urlSegments, this._appName, this._editValidate)
            .then(() => true)
            .catch(() => false)
        } else {
          return Promise.resolve(true);
        }
    }    

    /**
     * @description Realiza a chamada ao programa que irá retornar os campos customizáveis do cliente. O programa é carregado na chamada
     * ao método setupCustomFields.
     * @param action É enviado o nome do programa correspondente a ação (edição/detalhe). 
     */
    protected getCustomFields(action: string) {
        this._customService.getCustomFields(this._urlSegments, this._appName, action).then((data: TotvsGpsDynamicForm) => {
            if(data && data.fields.length > 0) {
              this.customFields = data;
              this.hasCustomFields = true;
            }
        });
    }
    //#endregion
}