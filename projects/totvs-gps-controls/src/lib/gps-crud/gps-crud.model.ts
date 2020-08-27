/**
 * Metodos comuns para services utilizados em CRUDs
 */
export interface ICRUDService<T> {

    insert(model: T): Promise<T>;
    update(model: T): Promise<T>;
    get(...args): Promise<T>;
    remove(...args): Promise<any>;

}

/**
 * Tipo para metodo de validação de dados ao salvar registro
 */
export type ValidateAction = () => boolean | Promise<boolean>;

