import { Component, OnInit } from '@angular/core';
import { ResponseService } from '../../services/response.service';

@Component({
    selector: 'app-response',
    templateUrl: './response.component.html',
    styleUrls: ['./response.component.css'],
})
export class ResponseComponent implements OnInit {
    constructor(private _responseService: ResponseService) {}

    ngOnInit(): void {}
}
