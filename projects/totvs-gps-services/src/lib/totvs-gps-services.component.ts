import { GPS_SERVICES } from "./totvs-gps-services.module";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs/operators";
import { TotvsGpsObjectModel, ITotvsGpsJsonParse, TTalkCollection } from "./totvs-gps-services.model";

/**
 * Classe de serviços
 */
export class TotvsGpsServices<T> {

    // Tipo de dado que será usado para o construtor do resultado
    private _type;
    // Parametros adicionais
    private _url: string;
    private _http: HttpClient;
    private _queryParams: any;
    // Parametros padrão T-Talk
    private _page: number;
    private _pageSize: number;
    private _fields: string[];
    private _expand: string[];

    /**
     * Retorna uma nova instância já parametrizada
     * @param type Tipo (Classe) de dados
     * @param url URL da API, que será utilizada ao invocar os métodos HTTP
     */
    public static getInstance<T>(type: any, url?: string): TotvsGpsServices<T> {
        let instance = new TotvsGpsServices<T>(type, GPS_SERVICES.HttpClient).setURL(url);
        return instance;
    }

    //#region Métodos construtores
    /**
     * Construtor. Recomenda-se utilizar o método getInstance() para instanciar a classe.
     * @param type Tipo (Classe) de dados
     * @param httpClient Instância HttpClient para invocar métodos HTTP
     */
    constructor(private type: {new():T}, private httpClient: HttpClient) {
        this._type = type;
        this._http = httpClient;
    }

    /**
     * Atribui a instância do HttpClient para a classe.
     * Recomenda-se utilizar o método getInstance() que já possui o HttpClient embutido.
     * @param httpClient Instância HttpClient para invocar métodos HTTP
     */
    public setHttpClient(httpClient: HttpClient): TotvsGpsServices<T> {
        this._http = httpClient;
        return this;
    }

    /**
     * Atribui a URL para ser utilizada ao invocar os métodos HTTP.
     * @param url URL da API, que será utilizada ao invocar os métodos HTTP
     */
    public setURL(url: string): TotvsGpsServices<T> {
        this._url = url;
        return this;
    }

    /**
     * Atribui o número da página a ser requisitada em um GET de coleção de dados
     * @param page Número da página a ser requisitada
     */
    public setPage(page: number): TotvsGpsServices<T> {
        this._page = page;
        return this;
    }

    /**
     * Atribui o tamanho da página a ser requisitada em um GET de coleção de dados
     * @param pageSize Tamanho da página a ser requisitada
     */
    public setPageSize(pageSize: number): TotvsGpsServices<T> {
        this._pageSize = pageSize;
        return this;
    }

    /**
     * Atribui a lista de campos que serão requisitadas em um GET
     * @param fields Lista de campos
     */
    public setFields(fields: string[]): TotvsGpsServices<T> {
        this._fields = fields;
        return this;
    }

    /**
     * Atribui a lista de campos que serão expandidos em um GET
     * @param expand Lista de campo
     */
    public setExpand(expand: string[]): TotvsGpsServices<T> {
        this._expand = expand;
        return this;
    }

    /**
     * Atribui um objeto que será passado nos parâmetros da URL em um GET
     * @param queryParams Objeto com os valores
     */
    public setQueryParams(queryParams: any): TotvsGpsServices<T> {
        this._queryParams = queryParams;
        return this;
    }
    //#endregion

    //#region Métodos de chamada HTTP
    private _get(url?: string, ttalk?:boolean): Promise<T | TTalkCollection<T>> {
        let requestHttp = this._http;
        let requestUrl = (url || this._url);
        requestUrl = this.appendQueryParams(requestUrl);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.get(requestUrl).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data, ttalk));
                },
                error => reject(error)
            );
        });
    }

    /**
     * Realiza a requisição GET de um objeto ou de uma coleção de objetos (array)
     * @param url URL do endpoint (caso não informado, será utilizada a URL atribuida como padrão da instância)
     */
    public get(url?: string): Promise<T> {
        return <Promise<T>>this._get(url, false);
    }

    /**
     * Realiza a requisição GET de um coleção de objetos, retornando no formato TTalkCollection
     * @param url URL do endpoint (caso não informado, será utilizada a URL atribuida como padrão da instância)
     */
    public getCollection(url?: string): Promise<TTalkCollection<T>> {
        return <Promise<TTalkCollection<T>>>this._get(url, true);
    }

    /**
     * Realiza a requisição POST
     * @param data Objeto a ser enviado no corpo (body) da requisição
     * @param url URL do endpoint (caso não informado, será utilizada a URL atribuida como padrão da instância)
     */
    public post(data: any, url?: string): Promise<T> {
        let requestHttp = this._http;
        let requestUrl = (url || this._url);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.post(requestUrl, data).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }

    /**
     * Realiza a requisição PUT
     * @param data Objeto a ser enviado no corpo (body) da requisição
     * @param url URL do endpoint (caso não informado, será utilizada a URL atribuida como padrão da instância)
     */
    public put(data: any, url?: string): Promise<T> {
        let requestHttp = this._http;
        let requestUrl = (url || this._url);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.put(requestUrl, data).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }

    /**
     * Realiza a requisição DELETE
     * @param url URL do endpoint (caso não informado, será utilizada a URL atribuida como padrão da instância)
     */
    public delete(url?: string): Promise<T> {
        let requestHttp = this._http;
        let requestUrl = (url || this._url);
        let resultFactory = this.resultFactory.bind(this);
        return new Promise(function(resolve, reject) {
            requestHttp.delete(requestUrl).pipe(take(1)).subscribe(
                data => {
                    resolve(resultFactory(data));
                },
                error => reject(error)
            );
        });
    }
    //#endregion

    //#region métodos internos para tratamento da chamada
    private appendQueryParams(url: string): string {
        let newUrl = url;
        let params = [];
        if (this._queryParams)
            Object.keys(this._queryParams).forEach(key => params.push(key + '=' + encodeURIComponent(this._queryParams[key])));
        if (this._page)
            params.push('page=' + this._page.toString());
        if (this._pageSize)
            params.push('pageSize=' + this._pageSize.toString());
        if (this._fields)
            params.push('fields=' + this._fields.join(','));
        if (this._expand)
            params.push('expand=' + this._expand.join(','));

        if (params.length > 0) {
            if (newUrl.indexOf('?') < 0)
                newUrl += '?';
            newUrl += params.join('&');
        }
        
        return newUrl;
    }
    //#endregion

    //#region métodos internos para conversão de dados
    private resultFactory(data: any, ttalk?: boolean): T | T[] | TTalkCollection<T> {
        if (!data)
            return null;
        if (this.isCollection(data)) {
            let newItems: T[] = data.items.map(item => {return this.itemFactory(item)});
            if (ttalk === true) {
                let result: TTalkCollection<T> = {
                    items: newItems,
                    hasNext: data.hasNext
                };
                return result;
            }
            return newItems;
        }
        return this.itemFactory(data);
    }

    private itemFactory(data: any): T {
        let obj = new TotvsGpsObjectModel<T>(this._type).createInstance();
        if (this.hasParseMethod(obj)) 
            (obj as ITotvsGpsJsonParse<T>).parseJsonToObject(data);
        else
            Object.assign(obj, data);
        return obj;
    }

    private hasParseMethod(arg: Object): arg is ITotvsGpsJsonParse<T> {
        return (arg as ITotvsGpsJsonParse<T>).parseJsonToObject !== undefined;
    }

    private isCollection(arg: Object): arg is TTalkCollection<T> {
        return (arg as TTalkCollection<T>).items !== undefined;
    }
    //#endregion

}