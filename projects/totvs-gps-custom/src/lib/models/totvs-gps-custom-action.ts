
export class TotvsGpsCustomAction {
    public id: string;
    public label: string;
    public url: string;
    public icon: string;
}

export interface PageAction {
    label: string;
    action?: Function;
    icon?: string;
}

export interface CustomAction {
    label: string;
    url: string;
    icon?: string;
}