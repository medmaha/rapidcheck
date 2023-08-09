import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Subscription } from 'rxjs';
import { ResponseService } from '../../services/response.service';
import { MainService } from '../../services/main.service';
import { RequestTab } from '../../models';
import { AxiosError, AxiosResponse } from 'axios';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit, OnDestroy {
    activeTab = {} as RequestTab;
    loading = false;

    private subscription: Subscription | undefined;

    constructor(
        private _mainService: MainService,
        private _requestService: RequestService,
        private _responseService: ResponseService
    ) {}

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe((_col) => {
            this.activeTab = this._mainService.getActiveRequestTab();
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    handleRequest(event: Event) {
        event.preventDefault();
        const formElement = event.currentTarget as HTMLFormElement;
        if (!formElement.checkValidity()) {
            formElement.reportValidity();
            return;
        }

        this.loading = true;
        this._responseService.loading.next(true);
        const form = new FormData(formElement);

        const requestPayload = {
            url: form.get('url')?.valueOf()! as string,
            method: form.get('method')?.valueOf()! as string,
        };

        const requestTab = this._mainService.getActiveRequestTab();

        requestTab.payload = {
            ...requestTab.payload,
            ...requestPayload,
        };

        this._mainService.saveRequestTab(requestTab);

        const iter = (fields: any) => {
            const data = {} as { [x: string]: string };
            for (const field of fields || []) {
                const { key, value } = field;
                if (key) {
                    data[key] = value;
                }
            }
            return data;
        };

        const abstractPayload = () => {
            let payload = { ...requestPayload } as any;
            for (const tabPayload of requestTab.payload.data) {
                switch (tabPayload.name) {
                    case 'Body':
                        payload.data = iter(tabPayload.fields);
                        break;
                    case 'Headers':
                        payload.headers = iter(tabPayload.fields);
                        break;
                    case 'Query':
                        const jsonQ = iter(tabPayload.fields);
                        const entries = Object.entries(jsonQ);
                        let url = ``;
                        let i = 0;
                        for (const entry of entries) {
                            const [key, value] = entry;
                            const nextQ = Boolean(entries[i + 1]);
                            if (key && value)
                                url += `${key}=${value}${nextQ ? '&' : ''}`;
                            i++;
                        }
                        if (url.length > 0) {
                            payload.url += `?${url}`;
                        }
                        break;
                    default:
                        break;
                }
            }
            return payload;
        };

        const payload = abstractPayload();
        this.makeRequest(payload);
    }

    async makeRequest(payload: any) {
        const res = await this._requestService.send(payload);
        this.loading = false;

        this._responseService.loading.next(false);
        this._responseService.update(res);
    }
}

type Field = any;
type Tab = {
    name: string;
    title: string;
    editorId: string;
    active: boolean;
    fields: Field[];
};
