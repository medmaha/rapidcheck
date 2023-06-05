import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestTab } from '../models';
import { generateID } from '../components/utils';
import { CookiesService } from './cookie.service';
import { RequestService } from './request.service';
import { MainService } from './main.service';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    histories = new BehaviorSubject([] as Array<History>);
    private HISTORY_BUCKET_STRING = 'histories';

    constructor(
        private _cookies: CookiesService,
        private _mainService: MainService
    ) {}

    init() {
        const _history = this._cookies.get({
            name: this.HISTORY_BUCKET_STRING,
        });

        if (_history) {
            this.histories.next(_history);
        }
    }

    create(request: RequestTab) {
        const history = {
            ...request,
            historyId: generateID(),
            active: true,
        } as History;

        const _history = this.histories.value;
        this.deactivateAllHistories(_history);

        _history.unshift(history);
        this.histories.next(_history);
        this.save(_history);
    }

    remove(id: string) {
        const histories = this.histories.value;

        const targetHistory = histories.find((h) => h.historyId === id);

        if (!targetHistory?.id) return;
        const _histories = histories.filter(
            (h) => h.historyId !== targetHistory.historyId
        );

        this.histories.next(_histories);
        this.save(_histories);

        if (targetHistory.active) {
            const historyIdx = histories.findIndex((h) => h.historyId === id);
            const prev = histories[historyIdx - 1];
            const next = histories[historyIdx + 1];

            this.switchActive(prev || next);
        }
    }

    switchActive(history: History) {
        if (!history) return;

        const histories = this.histories.value;

        const historyIdx = histories.findIndex(
            (h) => h.historyId === history.historyId
        );

        if (!Number.isNaN(historyIdx)) {
            this.deactivateAllHistories(histories);
            history.active = true;
            histories[historyIdx] = history;

            this.histories.next(histories);
            this.save(histories);

            this.margeMainService(history);
        }
    }

    private margeMainService(activeHistory: History) {
        const collections = this._mainService.getCollections();
        const targetCollection = collections.find(
            (col) => col.id === activeHistory.collectionId
        );

        if (targetCollection) {
            const activeRequest = targetCollection.tabs.find(
                (tab) => tab.id === activeHistory.id
            );
            if (activeRequest) {
                activeRequest.active = true;
                this._mainService.saveRequestTab(activeRequest);
                return;
            }

            const data = { ...activeHistory } as any;
            delete data['historyId'];
            this._mainService.saveRequestTab(data as RequestTab);
        }

        const activeCollection = collections.find((col) => col.active);

        if (activeCollection) {
            const data = { ...activeHistory } as any;
            delete data['historyId'];

            data.collectionId = activeCollection.id;
            this._mainService.saveRequestTab(data as RequestTab);
        }
    }

    private deactivateAllHistories(histories: Array<History>) {
        histories.forEach((h) => {
            h.active = false;
        });
    }

    private save(histories: Array<History>) {
        this._cookies.add({
            name: this.HISTORY_BUCKET_STRING,
            record: JSON.stringify(histories),
            options: {
                sameSite: 'Strict',
                path: '/',
            },
        });
    }
}

interface History extends RequestTab {
    historyId: string;
}
