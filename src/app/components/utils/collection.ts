//

import { generateID } from '.';
import { Collection } from '../../models';
import { getDummyRequestTab } from './request';

export function getDummyCollection(data: Collection): Collection {
    const id = generateID();
    const collection = {
        id: id,
        name: data.name || 'Untitled Collection',
        description: '',
        active: data.active,
        tabs: [
            getDummyRequestTab({
                active: data.active,
                collectionId: id,
            }),
        ],
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    };
    return collection;
}
