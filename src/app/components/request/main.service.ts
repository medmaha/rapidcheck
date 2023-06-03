import { Injectable } from '@angular/core';
import { CollectionArray, RequestTab } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MainService {
    constructor() {}

    collections = new BehaviorSubject([] as CollectionArray);

    init() {}

    getCollections() {
        return this.collections.value;
    }

    addRequestTab() {}
    removeRequestTab(tab: RequestTab) {}
    saveRequestTab(tab: RequestTab) {}

    getActiveRequestTab(): any {}
    switchActiveRequestTabs(tab: RequestTab) {}

    createCollection({}: any) {
        return this.collections.value[0];
    }
    updateCollection({}: any) {}
}
