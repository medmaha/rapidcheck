import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from './services/main.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'client';

    constructor(private _mainService: MainService) {}

    leftPanelSize = '60px';
    fullSpace = true;

    ngOnInit(): void {
        this._mainService.init();
        this.changePanelSize();
    }

    toggleLeftPanel(open: boolean) {
        this.fullSpace = open;
        this.changePanelSize();
    }

    changePanelSize() {
        const open = this.fullSpace || true;
        if (open) {
            this.leftPanelSize = 'grid-cols-[300px,1fr]';
        } else this.leftPanelSize = 'grid-cols-[60px,1fr]';
    }
}
