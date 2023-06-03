import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { getMethodColor } from '../../../../utils/request';
import { RequestTab } from '../../../../../models';
import { MainService } from '../../../../../services/main.service';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit {
    @Input() idx = 0;
    @Input() isLast = false;
    @Input() tab = {} as RequestTab;
    @Output() tabClicked = new EventEmitter<RequestTab>();
    @Output() closeTab = new EventEmitter<{ tab: RequestTab; idx: number }>();

    methodColor = '';

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        this.methodColor = getMethodColor(this.tab.payload.method);
    }

    onBodyClick() {
        this.tabClicked.emit();
    }
    onCloseClick() {
        this.closeTab.emit({ tab: this.tab, idx: this.idx });
    }
}
