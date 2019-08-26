export interface ICacheValue {
    index: string;
    data?: any;
}

export interface ICacheList {
    values: ICacheValue[];
}
