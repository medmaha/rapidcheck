import { Component, Input, OnInit } from '@angular/core';
import { ResponseService } from '../../../../services/response.service';

@Component({
    selector: 'app-headings',
    templateUrl: './headings.component.html',
    styleUrls: ['./headings.component.css'],
})
export class HeadingsComponent implements OnInit {
    @Input() requested: boolean = false;

    metadata = {
        status: '',
        size: '',
        time: '',
        success: false,
    };

    constructor(private _responseService: ResponseService) {}

    ngOnInit(): void {
        this._responseService.meta.subscribe((meta) => {
            this.metadata.size = meta.size;
            this.metadata.status = meta.status;
            this.metadata.time = meta.time;
            this.metadata.success = meta.success;
            this.requested = meta.requested;
        });
    }
}
