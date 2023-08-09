import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { MainService } from './main.service';
import { RequestService } from './request.service';

@Injectable({
    providedIn: 'root',
})
export class ResponseService {
    constructor(
        private _mainService: MainService,
        private _requestService: RequestService
    ) {}
    data = new BehaviorSubject('\n\n');
    meta = new BehaviorSubject({} as Meta);
    loading = new BehaviorSubject(false);

    update(data: any) {
        this.abstractResponse(data);
    }

    async abstractResponse(res: AxiosError | AxiosResponse) {
        if (res instanceof AxiosError) {
            const { response, request } = res;
            if (response) {
                this.dispatchMetaData(response, false);
                return;
            }
            if (request) {
                const status = request.status || 408;
                const payload = {
                    ...res,
                    status,
                    statusText: res.message,
                    data: { Reason: res.message },
                };
                this.dispatchMetaData(payload, false);
                return;
            }
            this.dispatchMetaData(
                { ...res, data: { Reason: res.message } },
                false
            );
            return;
        }
        if (res.status < 300) {
            this.dispatchMetaData(res);
            return;
        }
        this.dispatchMetaData(res, false);
    }
    dispatchMetaData(payload: any, success = true) {
        const { data, config, status, statusText, headers } = payload;
        const meta = {} as Meta;

        meta.data = data;
        meta.requested = true;
        meta.success = success;
        meta.activeTab = 'body';
        meta.time = this.getResponseTime(payload.duration || 0);
        meta.size = this.getResponseSize(JSON.stringify(data));
        meta.status = this.getResponseStatus(status, statusText);
        meta.header = {
            ...config.headers,
            ...headers,
        };

        this.data.next(data);
        this.meta.next(meta);

        const activeRequestTab = this._mainService.getActiveRequestTab();
        activeRequestTab.payload.status_code = String(status);

        this._mainService.saveRequestTab(activeRequestTab);
        this._requestService.req.next(activeRequestTab);
    }

    getResponseSize(data: string) {
        let bytes = 0;

        try {
            const itr = (data || '').split('');

            itr.forEach(() => bytes++);

            if (bytes > 100) {
                const kb = `${(bytes / 1000).toFixed(1)} kb`;

                return kb;
            }
            const kb = `${bytes} bytes`;

            return kb;
        } catch (error) {
            return '0';
        }
    }
    getResponseTime(duration: number) {
        const ms = `${duration} ms`;

        return ms;
    }
    getResponseStatus(status: number, text: string) {
        const _status = `${status} ${text}`;

        return _status;
    }
}

interface Meta {
    requested: boolean;
    success: boolean;
    status: string;
    data: any;
    time: string;
    size: string;
    header: KeyValuePair;
    activeTab: 'body' | 'headers';
}

type KeyValuePair = { [key: string]: string };
