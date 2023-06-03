import { Component, Input, OnDestroy } from '@angular/core';
import { Collection } from '../../../../../models';

let COLLAPSED = false;
@Component({
    selector: 'app-col-request',
    templateUrl: './col-request.component.html',
    styleUrls: ['./col-request.component.css'],
})
export class ColRequestComponent {
    @Input() collection = {} as Collection;

    collapsed = COLLAPSED;

    toggleCollapse() {
        this.collapsed = Boolean(!this.collapsed);
        COLLAPSED = this.collapsed;
    }
}
