import { Component } from '@angular/core';

let COLLAPSED = true;

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
    collapsed = COLLAPSED;

    toggleCollapse() {
        this.collapsed = !this.collapsed;
        COLLAPSED = this.collapsed;
    }
}
