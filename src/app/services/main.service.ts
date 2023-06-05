import { Injectable } from '@angular/core';
import { Collection, CollectionArray, RequestTab } from '../models';
import { BehaviorSubject } from 'rxjs';
import { CookiesService } from './cookie.service';
import { getDummyCollection } from '../components/utils/collection';
import { getDummyRequestTab } from '../components/utils/request';

@Injectable({
    providedIn: 'root',
})
export class MainService {
    constructor(private _cookies: CookiesService) {}

    collections = new BehaviorSubject([] as CollectionArray);

    theme = new BehaviorSubject('light');

    private COLLECTION_BUCKET_STRING = 'collections';

    init() {
        let __collections = this._cookies.get({
            name: this.COLLECTION_BUCKET_STRING,
        }) as CollectionArray | null;

        if (!__collections) {
            __collections = [];
            const collection = getDummyCollection({
                active: true,
            } as Collection);
            __collections.push(collection);
        }

        this.collections.next(__collections);
        this.save(__collections);
    }

    getCollections() {
        return this.collections.value;
    }

    getActiveCollection(collections?: CollectionArray): Collection {
        if (!collections) collections = this.getCollections();

        let activeCollection = collections.find((col) => col.active);

        if (activeCollection) return activeCollection;

        activeCollection = collections[0];
        if (activeCollection) return activeCollection;

        this.init();

        return this.getActiveCollection();
    }

    getActiveRequestTab(collections?: CollectionArray): RequestTab {
        if (!collections) collections = this.getCollections();

        let activeTab = collections
            .find((col) => col.active)
            ?.tabs.find((tab) => tab.active);

        if (activeTab) return activeTab;

        activeTab = collections[0].tabs[0];
        if (activeTab) return activeTab;

        this.init();

        return this.getActiveRequestTab();
    }

    addRequestTab() {
        const collections = this.getCollections();
        const activeCollection = this.getActiveCollection(collections);

        const tab = getDummyRequestTab({
            active: true,
            collectionId: activeCollection.id,
        });

        this.deactivateAllRequestTabs(collections);
        activeCollection.tabs.unshift(tab);

        // Dispatch changes
        const collectionIdx = collections.findIndex(
            (col) => col.id === activeCollection.id
        );

        collections[collectionIdx] = activeCollection;
        this.collections.next(collections);
        this.save(collections);
    }

    removeRequestTab(tab: RequestTab) {
        const collections = this.getCollections();
        const activeCollection = collections.find(
            (col) => col.id === tab.collectionId
        );

        if (activeCollection) {
            const tabs = activeCollection.tabs;

            // Alert user for tab collection delete
            if (tabs.length < 2) return;

            const tabIndex = tabs.findIndex((_tab) => _tab.id === tab.id);

            const prev = tabs[tabIndex - 1];
            const next = tabs[tabIndex + 1];

            if (prev || (next && tab.active)) {
                this.deactivateAllRequestTabs(collections);
                if (prev) {
                    prev.active = true;
                } else if (next) {
                    next.active = true;
                }
            }
            activeCollection.tabs = activeCollection.tabs.filter(
                (_tab) => _tab.id !== tab.id
            );
            this.collections.next(collections);
            this.save(collections);
        }
    }

    saveRequestTab(tab: RequestTab) {
        const collections = this.getCollections();

        const activeCollection = collections.find(
            (col) => col.id === tab.collectionId
        );

        if (activeCollection) {
            const tabInx = activeCollection.tabs.findIndex(
                (_tab) => _tab.id === tab.id
            )!;

            this.deactivateAllCollectionsAndRequests(collections);

            tab.active = true;
            activeCollection.active = true;

            tab.updatedAt = Date.now().toString();

            if (activeCollection.tabs[tabInx]) {
                activeCollection.tabs[tabInx] = { ...tab };
            } else {
                activeCollection.tabs.unshift(tab);
            }
            activeCollection.updatedAt = Date.now().toString();

            this.collections.next(collections);
            this.save(collections);
        }
    }

    switchActiveRequestTabs(tab: RequestTab) {
        const collections = this.getCollections();
        this.deactivateAllCollectionsAndRequests(collections);

        const activeCollection = collections.find(
            (col) => col.id === tab.collectionId
        );
        const targetTab = activeCollection?.tabs.find(
            (_tab) => _tab.id === tab.id
        );

        if (activeCollection && targetTab) {
            activeCollection.tabs.forEach((_tab) => {
                _tab.active = false;
            });

            targetTab.active = true;
            activeCollection.active = true;

            this.collections.next(collections);
        }
        this.save(collections);
    }

    createCollection({ name, active }: { name: string; active: boolean }) {
        const collections = this.getCollections();
        const collection = getDummyCollection({
            name,
            active,
        } as Collection);

        this.deactivateAllCollectionsAndRequests(collections);

        collections.unshift(collection);

        this.collections.next(collections);
        this.save(collections);

        return collection;
    }

    updateCollection({ colId, data }: { colId: string; data: Collection }) {
        const collections = this.getCollections();
        const targetCollection = collections.find((col) => col.id === colId);

        const collectionIdx = collections.findIndex((col) => (col.id = colId));

        const payload = {
            ...targetCollection,
            ...data,
        };

        collections[collectionIdx] = payload;

        this.collections.next(collections);
        this.save(collections);
    }

    save(collections: CollectionArray) {
        this._cookies.add({
            name: this.COLLECTION_BUCKET_STRING,
            record: JSON.stringify(collections),
            options: {
                sameSite: 'Strict',
            },
        });
    }

    deactivateAllRequestTabs(collections: CollectionArray) {
        collections.forEach((col) => {
            col.tabs.forEach((tab) => {
                tab.active = false;
            });
        });
    }

    deactivateAllCollections(collections: CollectionArray) {
        collections.forEach((col) => {
            col.active = false;
        });
    }

    deactivateAllCollectionsAndRequests(collections: CollectionArray) {
        collections.forEach((col) => {
            col.active = false;
            col.tabs.forEach((tab) => {
                tab.active = false;
            });
        });
    }
}
