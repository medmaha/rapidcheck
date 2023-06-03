import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { MainService } from '../../../services/main.service';
import { Collection, RequestTab } from '../../../models';

@Component({
    selector: 'app-headers',
    templateUrl: './headers.component.html',
    styleUrls: ['./headers.component.css'],
})
export class HeadersComponent implements OnInit, OnDestroy {
    collection = {} as Collection;

    timeout: any | undefined;
    private subscription: Subscription | undefined;

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe(
            (collections) => {
                this.collection = collections.find((col: any) => col.active)!;
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    addTab() {
        this._mainService.addRequestTab();
        this.scrollToLastTab();
    }

    handleTabClick(tab: RequestTab) {
        this._mainService.switchActiveRequestTabs(tab);
    }
    handleTabClose({ tab, idx }: { tab: RequestTab; idx: number }) {
        this._mainService.removeRequestTab(tab);
    }

    scrollToLastTab() {
        const tabs = document.querySelector(
            `.app-header .tabs`
        ) as HTMLDivElement | null;

        // tabs?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            tabs?.scrollTo({
                top: 0,

                left: 5000,
                behavior: 'smooth',
            });
        }, 120);
    }
}
