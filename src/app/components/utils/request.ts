//

import { generateID } from '.';
import { RequestTab } from '../../models';

// import { Methods } from '../../services/types';

export function getMethodColor(method: string) {
    switch (method.toLowerCase()) {
        case 'post':
            return 'text-green-500 text-opacity-90';
        case 'get':
            return 'text-orange-500 text-opacity-90';
        case 'delete':
            return 'text-red-500 text-opacity-90';
        case 'put':
            return 'text-yellow-400';
        case 'patch':
            return 'text-yellow-400';
        case 'options':
            return 'font-semibold';
        default:
            return '';
    }
}

export function getStatusColor(status: number) {
    switch (true) {
        case status >= 400:
            return 'text-red-500 text-opacity-90';
        case status >= 300:
            return 'text-yellow-500 text-opacity-90';
        case status >= 200:
            return 'text-green-500 text-opacity-90';

        default:
            return '';
    }
}

export function getDummyRequestTab({
    active,
    collectionId,
}: {
    active: boolean;
    collectionId: string;
}): RequestTab {
    return {
        active,
        collectionId,
        description: '',
        id: generateID(),
        name: 'Untitled Request',
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
        payload: {
            url: '',
            method: 'GET',
            data: initialTabPayload(),
            status_code: '',
        },
    };
}

type TabPayloadField = {
    key?: string;
    value?: string;
    description?: string;
    autoFucus: boolean;
};

type TabPayload = {
    name: 'Params' | 'Headers' | 'Body' | 'Query';
    title: string;
    editorId: string;
    active: boolean;

    fields: TabPayloadField[];
    id: string;
};

export function initialTabPayload(): TabPayload[] {
    const f = () => ({ key: '', value: '', description: '', autoFucus: false });
    return [
        {
            name: 'Params',
            title: 'Query Params',
            editorId: 'queryTab',
            active: true,
            id: 'r-params',
            fields: [f(), f()],
        },
        {
            name: 'Headers',
            title: 'Request Headers',
            editorId: 'headerTab',
            active: false,
            id: 'r-headers',
            fields: [f(), f()],
        },
        {
            name: 'Body',
            title: 'FormData',
            editorId: 'bodyTab',
            active: false,
            id: 'r-body',
            fields: [f(), f()],
        },
        {
            name: 'Query',
            title: 'Query String',
            editorId: 'bodyTab',
            active: false,
            id: 'r-query',
            fields: [f(), f()],
        },
    ];
}
