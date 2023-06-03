import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-left-panel',
    templateUrl: './left-panel.component.html',
    styleUrls: ['./left-panel.component.css'],
})
export class LeftPanelComponent implements OnInit {
    @Input() fullSpace = false;
    @Output() togglePanel = new EventEmitter<boolean>();

    thisYear = '';

    ngOnInit(): void {
        this.thisYear = new Date().getFullYear().toString();
    }

    toggleSpace() {
        this.togglePanel.emit(!this.fullSpace);
    }
}
