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
    property: string;
    /**
     * Função para conversao do valor (ex: para pegar descrição de enumeradores)
     * @template (value:any) => string
     */
    value?: Function;
    /**
     * Tipo do valor
     */
    type?: 'string' | 'number' | 'date';
    /**
     * Nome do agrupador, para acumular diversos valores em um mesmo disclaimer
     */
    group?: string;
    /**
     * Separador a ser utilizado quando agrupar valores no mesmo disclaimer
     */
    separator?: string;
}