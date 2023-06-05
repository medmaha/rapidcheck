import { Component, Input, OnDestroy } from '@angular/core';
import { Collection } from '../../../../../models';
import { MainService } from '../../../../../services/main.service';

let COLLAPSED = false;
@Component({
    selector: 'app-col-request',
    templateUrl: './col-request.component.html',
    styleUrls: ['./col-request.component.css'],
})
export class ColRequestComponent {
    @Input() collection = {} as Collection;

    constructor(private _mainService: MainService) {}

    collapsed = COLLAPSED;

    dropdown = false;

    toggleCollapse() {
        this.collapsed = Boolean(!this.collapsed);
        COLLAPSED = this.collapsed;
    }

    deleteCollection() {
        this._mainService.removeCollection(this.collection.id);
    }

    toggleDropdown() {
        this.dropdown = !this.dropdown;
    }
}
