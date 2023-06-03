import { Component, Input, OnInit } from '@angular/core';
import { MainService } from '../../../../../services/main.service';
import { RequestTab } from '../../../../../models';
import { getMethodColor } from '../../../../utils/request';

@Component({
    selector: 'app-col-request-tab',
    templateUrl: './col-request-tab.component.html',
    styleUrls: ['./col-request-tab.component.css'],
})
export class ColRequestTabComponent implements OnInit {
    @Input() tab = {} as RequestTab;
    @Input() idx: number = 0;
    methodColor = '';

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        this.methodColor = getMethodColor(this.tab.payload.method);
    }

    handleRequestClick() {
        this._mainService.switchActiveRequestTabs(this.tab);
    }
    handleDeleteRequest(ev: Event) {
        ev.preventDefault();
        // this.ma
        this._mainService.removeRequestTab(this.tab);
    }
}
