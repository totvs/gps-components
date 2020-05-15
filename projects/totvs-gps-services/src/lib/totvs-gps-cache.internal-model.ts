export interface ICacheValue {
    index: string;
    data?: any;
    ready: boolean;
    onReady: Function[];
}

export interface ICacheList {
    values: ICacheValue[];
}
