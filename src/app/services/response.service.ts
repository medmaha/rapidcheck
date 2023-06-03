import { Injectable } from '@angular/core';
import { CollectionArray, RequestTab } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResponseService {
    constructor() {}

    data = new BehaviorSubject('');
}
