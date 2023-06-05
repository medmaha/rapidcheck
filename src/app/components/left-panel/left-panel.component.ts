import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-left-panel',
    templateUrl: './left-panel.component.html',
    styleUrls: ['./left-panel.component.css'],
})
export class LeftPanelComponent implements OnInit, OnDestroy {
    @Input() fullSpace = false;
    @Output() togglePanel = new EventEmitter<boolean>();

    thisYear = '';
    bodyTouched = false;

    ngOnInit(): void {
        this.thisYear = new Date().getFullYear().toString();
        // document.body.classList.add('overflow-x-hidden');
        this.bodyTouched = true;
    }

    ngOnDestroy(): void {
        if (this.bodyTouched) {
            // document.body.classList.remove('overflow-x-hidden');
        }
    }

    toggleSpace() {
        const open = this.fullSpace !== true;
        this.togglePanel.emit(open);
        document.body.classList.toggle('overflow-x-hidden', open);
    }
}
