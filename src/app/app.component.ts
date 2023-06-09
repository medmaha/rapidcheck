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
    fullSpace = false;

    ngOnInit(): void {
        this._mainService.init();
        this.changePanelSize();

        const darkTheme = localStorage.getItem('theme') === 'dark';

        if (darkTheme) {
            this._mainService.theme.next('dark');
            document.body.classList.add('dark');
        }
    }

    toggleLeftPanel(open: boolean) {
        this.fullSpace = open;
        this.changePanelSize();
    }

    changePanelSize() {
        const open = this.fullSpace;
        if (open) {
            this.leftPanelSize = 'grid-cols-[250px,1fr]';
        } else this.leftPanelSize = 'grid-cols-[60px,1fr]';
    }
}
