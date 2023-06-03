import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Collection, CollectionArray, RequestTab } from '../../../models';
import { MainService } from '../../../services/main.service';
import { generateID } from '../../utils';

let STASHED_CHANGES = {} as RequestTab;

let TAB_TO_REMOVE = {} as RequestTab;

@Component({
    selector: 'app-save-request',
    templateUrl: './save-request.component.html',
    styleUrls: ['./save-request.component.css'],
})
export class SaveRequestComponent implements OnInit, OnDestroy {
    @Output() closeSave = new EventEmitter();

    collections = [] as CollectionArray;
    tab = {} as RequestTab;
    addDesc = false;
    isInvalid = true;
    subscription: Subscription[] | undefined;
    activeCollectionId: string = '';

    createNewCollection: boolean = false;
    editCollectionData: null | Collection = null;

    SELECTS_COLLECTION = false;
    tabName = '';

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        this.activeCollectionId = this._mainService.collections.value.find(
            (_col) => _col.active
        )?.id!;
        this.subscription = [
            this._mainService.collections.subscribe((value) => {
                this.collections = value;
                this.tab = this._mainService.getActiveRequestTab();
            }),
        ];
    }

    ngOnDestroy(): void {
        this.subscription?.forEach((s) => s.unsubscribe());
    }

    toggleDescription() {
        this.addDesc = !this.addDesc;
    }

    handleFormChange(event: Event) {
        const form = event.currentTarget as HTMLFormElement;
        const input = event.target as HTMLInputElement;
        this.tabName = input?.value || this.tabName;
        this.isInvalid = form.checkValidity() ? false : true;
    }

    handleFormSubmit(event: Event) {
        event.preventDefault();

        const element = event.currentTarget as HTMLFormElement;
        const form = new FormData(element);

        const data = {} as RequestTab;

        data.name = (form.get('r-name') || this.tab.name) as string;
        data.description = (form.get('r-desc') ||
            this.tab.description) as string;

        if (STASHED_CHANGES.id) {
            const tab = STASHED_CHANGES;
            const collectionId = STASHED_CHANGES.collectionId;

            this._mainService.saveRequestTab({
                ...tab,
                id: generateID(),
                active: true,
                name: data.name,
                payload: tab.payload,
                collectionId: collectionId,
                description: data.description,
            });

            if (TAB_TO_REMOVE?.id) {
                this._mainService.removeRequestTab(TAB_TO_REMOVE);
            }

            STASHED_CHANGES = {} as typeof STASHED_CHANGES;
            TAB_TO_REMOVE = {} as typeof TAB_TO_REMOVE;
        } else {
            const tab = this._mainService.getActiveRequestTab();
            this._mainService.saveRequestTab({
                ...tab,
                ...data,
                active: true,
            });
        }

        this.closeModal();
    }

    editCollection(collection: Collection) {
        this.editCollectionData = collection;
    }

    createCollection() {
        this.createNewCollection = true;
    }

    closeModal() {
        this.closeSave.emit();
    }

    handleCollectionClick(collectionID: string) {
        // collection = Object.assign({}, collection);
        const tab = this.tab;

        if (collectionID === tab.collectionId) return;

        const collections = this._mainService.getCollections();

        const activeCollection = collections.find((col) => col.active)!;

        const selectedCollection = collections.find(
            (_col) => _col.id === collectionID
        )!;

        this.SELECTS_COLLECTION = true;

        if (activeCollection.tabs.length === 1) {
            activeCollection.active = false;
        } else {
            TAB_TO_REMOVE = {
                ...tab,
                collectionId: activeCollection.id,
                active: false,
            };
        }
        this.activeCollectionId = selectedCollection.id;

        STASHED_CHANGES = {
            ...tab,
            active: true,
            collectionId: selectedCollection.id,
        };
    }

    onAddCreateClose() {
        this.createNewCollection = false;
        this.editCollectionData = null;
    }

    onAddCreateSave({ name, colId }: { name: string; colId?: string }) {
        const isNew = Boolean(colId) === false;

        if (isNew) {
            const tab = { ...this.tab } as RequestTab;

            this._mainService.removeRequestTab(this.tab);

            const collection = this._mainService.createCollection({
                name,
                active: true,
            });

            this.tab = {
                ...collection.tabs[0],
                name: this.tab.name,
                payload: this.tab.payload,
                collectionId: collection.id,
            };

            this.editCollectionData = collection;
            this.SELECTS_COLLECTION = true;
            this.tabName = this.tab.name;

            STASHED_CHANGES = {
                ...this.tab,
                collectionId: collection.id,
            };
        } else {
            this._mainService.updateCollection({
                colId: this.editCollectionData?.id!,
                data: { name } as Collection,
            });
        }
        this.onAddCreateClose();
    }
}
