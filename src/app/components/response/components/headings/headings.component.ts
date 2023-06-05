import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResponseService } from '../../../../services/response.service';
import { Subscription } from 'rxjs';
import { MainService } from '../../../../services/main.service';

@Component({
    selector: 'app-headings',
    templateUrl: './headings.component.html',
    styleUrls: ['./headings.component.css'],
})
export class HeadingsComponent implements OnInit, OnDestroy {
    @Input() requested: boolean = false;

    metadata = {
        status: '',
        size: '',
        time: '',
        success: false,
    };
    subscription: Subscription | undefined;

    constructor(private _responseService: ResponseService) {}

    ngOnInit(): void {
        this.subscription = this._responseService.meta.subscribe((meta) => {
            this.metadata.size = meta.size;
            this.metadata.status = meta.status;
            this.metadata.time = meta.time;
            this.metadata.success = meta.success;
            this.requested = meta.requested;
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
