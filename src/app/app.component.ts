import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainService } from './services/main.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'RapidCheck';

    constructor(private _mainService: MainService) {}

    leftPanelSize = '60px';
    fullSpace = false;

    screenSize = 0;
    resizeTimeout: any;

    handleScreenSize() {
        this.screenSize = window.innerWidth;

        // if (this.resizeTimeout) clearTimeout(this.resizeTimeout);

        if (this.screenSize < 650)
            alert('Your device width is a bit small for this web-app');
        // this.resizeTimeout = setTimeout(() => {
        //     if (this.screenSize < 650)
        //         alert('Your device width is a bit small for this web-app');
        //     else clearTimeout(this.resizeTimeout);
        // }, 3000);
    }

    ngOnInit(): void {
        this._mainService.init();
        this.changePanelSize();
        // window.addEventListener('resize', this.handleScreenSize);
        this.handleScreenSize();
    }

    ngOnDestroy(): void {
        window.addEventListener('resize', this.handleScreenSize);
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
