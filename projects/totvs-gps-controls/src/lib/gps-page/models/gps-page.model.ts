/**
 * Configuração para geração de disclaimers pela função updateDisclaimers()
 */
export interface IDisclaimerConfig {
    /**
     * Prefixo que será utilizado no disclaimer
     * No caso de varios disclaimers agrupados, será utilizado o do ultimo a ter valor
     */
    label: string;
    /**
     * Propriedade do objeto com o valor do disclaimer
     */
    property?: string;
    /**
     * Função para conversao do valor (ex: para pegar descrição de enumeradores)
     * @template (value:any) => string
     */
    value?: Function;
    /**
     * Tipo do valor. @default string
     * - `date` converte para a data em formato local (ex: DD/MM/AAAA)
     * - `boolean` converte para a `Sim` ou `Não`
     * - `true` exibe apenas o label quando o valor da propriedade for verdadeiro
     * - `string` e `number` não fazem tratamentos especiais (apenas para identificação do tipo de dado)
     * - `function` passa o objeto para o metodo `value` e considera o resultado como valor (nao utiliza a property)
     */
    type?: 'string' | 'number' | 'date' | 'boolean' | 'true' | 'function';
    /**
     * Nome do agrupador, para acumular diversos valores em um mesmo disclaimer
     */
    group?: string;
    /**
     * Separador a ser utilizado quando agrupar valores no mesmo disclaimer
     */
    separator?: string;

    /**
     * Se verdadeiro, oculta o botão para fechar o disclaimer.
     */
    hideClose?: boolean;
}

/**
 * Metodos comuns para services utilizados em CRUDs
 */
export interface ICRUDService<T> {
    insert(model: T): Promise<T>;
    update(model: T): Promise<T>;
    get(...args): Promise<T>;
    remove(...args): Promise<any>;
}
