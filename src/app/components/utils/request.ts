//

import { generateID } from '.';
import { RequestTab } from '../../models';

// import { Methods } from '../../services/types';

export function getMethodColor(method: string) {
    switch (method) {
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
            headers: {},
            queryString: {},
            queryParams: {},
            status_code: '',
            body: {},
        },
    };
}
