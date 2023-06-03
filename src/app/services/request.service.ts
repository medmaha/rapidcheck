import { Injectable } from '@angular/core';
import { CollectionArray, RequestTab } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    constructor() {}

    send(data: any): any {}
    makeRequest(data: any): any {}
}
