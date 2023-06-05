import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResponseService } from '../../services/response.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-response',
    templateUrl: './response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent implements OnInit, OnDestroy {
    @Input() fullscreen = false;
    subscription: Subscription | undefined;
    loading = false;
    constructor(private _responseService: ResponseService) {}

    ngOnInit(): void {
        this._responseService.loading.subscribe((value) => {
            this.loading = value;
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
