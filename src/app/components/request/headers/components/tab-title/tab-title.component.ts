import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { MainService } from '../../../../../services/main.service';
import { RequestTab } from '../../../../../models';

@Component({
    selector: 'app-tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.css'],
})
export class TabTitleComponent implements OnInit, OnDestroy {
    save = false;
    tab = {} as RequestTab;

    constructor(private _mainService: MainService) {}
    private subscription: Subscription | undefined;

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe((_col) => {
            this.tab =
                _col.find((c) => c.active)?.tabs.find((t) => t.active)! || {};
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    toggleSave() {
        this.save = !this.save;
    }
}
