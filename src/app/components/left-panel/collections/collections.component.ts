import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { MainService } from '../../../services/main.service';
import { CollectionArray } from '../../../models';

let COLLAPSED = true;
@Component({
    selector: 'app-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.css'],
})
export class CollectionsComponent implements OnInit, OnDestroy {
    constructor(private _mainService: MainService) {}

    collections = [] as CollectionArray;
    subscription: Subscription | undefined;

    collapsed = COLLAPSED;

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe(
            (cols) => (this.collections = cols)
        );
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        COLLAPSED = this.collapsed;
    }
}
