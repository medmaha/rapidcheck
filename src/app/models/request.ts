export type RequestTab = {
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
        data: TabPayload[];
        status_code: string;
    };
};

export type TabPayloadField = {
    key?: string;
    value?: string;
    description?: string;
    autoFucus: boolean;
};

export type TabPayload = {
    name: 'Params' | 'Headers' | 'Body' | 'Query';
    title: string;
    editorId: string;
    active: boolean;
    fields: TabPayloadField[];
    id: string;
};
