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

    getFieldValues(containerId: string, wrapper: HTMLDivElement) {
        const element = wrapper.querySelector(containerId)!;
        const keyValueWrapper = element.querySelectorAll(
            '[data-key-value-pairs]'
        );
        const data = {} as { [key: string]: any };
        keyValueWrapper.forEach((pair) => {
            const key = pair.querySelector('[data-key]')?.querySelector('input')
                ?.value as string;
            const value = pair
                .querySelector('[data-value]')
                ?.querySelector('input')?.value as string;

            if (key) {
                data[key] = value;
            }
        });
        return data;
    }

    getParams(container: HTMLDivElement) {
        return this.getFieldValues('#r-params', container);
    }
    getQuery(container: HTMLDivElement) {
        return this.getFieldValues('#r-query', container);
    }
    getBody(container: HTMLDivElement) {
        return this.getFieldValues('#r-body .formData', container);
    }

    getHeaders(container: HTMLDivElement) {
        return this.getFieldValues('#r-headers', container);
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

        const payloadsElement = document.getElementById(
            'requestPayload'
        ) as HTMLDivElement;

        const requestPayload = {
            url: form.get('url'),
            method: form.get('method'),
            headers: this.getHeaders(payloadsElement),
            queryParams: this.getParams(payloadsElement),
            queryString: this.getQuery(payloadsElement),
            data: this.getBody(payloadsElement),
        } as RequestTab['payload'];

        this.saveRequest(requestPayload);

        // this._requestService.update(requestPayload);
    }

    saveRequest(payload: RequestTab['payload']) {
        const activeTab = this._mainService.getActiveRequestTab();
        this._mainService.saveRequestTab({
            ...activeTab,
            payload: {
                ...activeTab.payload,
                ...payload,
            },
        });
        this.makeRequest(payload);
    }
    async makeRequest(payload: RequestTab['payload']) {
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
