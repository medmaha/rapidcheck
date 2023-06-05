import { Component, OnDestroy, OnInit } from '@angular/core';
import { History } from '../../../models';
import { Subscription } from 'rxjs';
import { HistoryService } from '../../../services/history.service';
import { MainService } from '../../../services/main.service';
import { RequestService } from '../../../services/request.service';
import { getMethodColor, getStatusColor } from '../../utils/request';

let COLLAPSED = false;

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit, OnDestroy {
    collapsed = COLLAPSED;
    histories = [] as Array<History>;

    private subscription: Subscription[] | undefined;

    constructor(
        private _historyService: HistoryService,
        private _requestService: RequestService
    ) {}

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        COLLAPSED = this.collapsed;
    }

    ngOnInit(): void {
        this._historyService.init();
        this.subscription = [];
        this.subscription[0] = this._historyService.histories.subscribe(
            (value) => {
                this.histories = value;
            }
        );
        this.subscription[1] = this._requestService.req.subscribe((value) => {
            if (value.id) {
                this._historyService.create(value);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription[0]?.unsubscribe();
            this.subscription[1]?.unsubscribe();
        }
    }

    deleteHistory(id: string) {
        this._historyService.remove(id);
    }

    activeHistory(history: History) {
        this._historyService.switchActive(history);
    }

    _getMethodColor(method: string) {
        return getMethodColor(method);
    }
    _getStatusColor(status: string) {
        return getStatusColor(Number(status));
    }
}
