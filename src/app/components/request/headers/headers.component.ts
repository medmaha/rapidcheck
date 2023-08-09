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
    darkTheme = true;
    private subscription: Subscription[] | undefined;

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        document.body.classList.toggle(
            'dark',
            localStorage.getItem('theme') === 'dark'
        );
        this.subscription = [];
        this.subscription[0] = this._mainService.collections.subscribe(
            (collections) => {
                this.collection = collections.find((col: any) => col.active)!;
            }
        );
        // this.subscription[1] = this._mainService.theme.subscribe((theme) => {
        //     this.darkTheme = theme === 'dark';
        // });
    }

    ngOnDestroy(): void {
        this.subscription?.forEach((s) => s.unsubscribe());
    }

    addTab() {
        const activeCollection = this._mainService.getActiveCollection();

        if (activeCollection.tabs.length < 10) {
            this._mainService.addRequestTab();
            this.scrollToLastTab();
        } else {
            alert(
                '                [Operation Error]\nYou have reach the max Tab count'
            );
        }
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

    toggleTheme() {
        const isDark = document.body.classList.contains('dark');
        let theme: 'light' | 'dark' = 'light';
        if (isDark) {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', '');
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            theme = 'dark';
        }
        this._mainService.theme.next(theme);
    }
}
