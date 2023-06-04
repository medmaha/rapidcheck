interface KeyValuePair {
    [key: string]: any;
}

export interface RequestTab {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    collectionId: string;
    payload: {
        url: string;
        method: string;
        headers: KeyValuePair;
        queryString: KeyValuePair;
        queryParams: KeyValuePair;
        data?: KeyValuePair;
        status_code: string;
    };
}
