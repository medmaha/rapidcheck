import { RequestTab } from './request';

export interface Collection {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    tabs: Array<RequestTab>;
}

export type CollectionArray = Array<Collection>;
