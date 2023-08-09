import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestTab } from '../../../../models';
import { MainService } from '../../../../services/main.service';
import { TabPayload, TabPayloadField } from '../../../../models/request';

@Component({
    selector: 'app-request-payload',
    templateUrl: './request-payload.component.html',
    styleUrls: ['./request-payload.component.css'],
})
export class RequestPayloadComponent implements OnInit, OnDestroy {
    payloadTabs: TabPayload[] = [];

    activePayloadTab: TabPayload | undefined;

    currentRequestTab = {} as RequestTab;

    subscription: Subscription | undefined;

    constructor(private _mainService: MainService) {}

    dispatchActiveTabPayload(tab: TabPayload, payloads?: TabPayload[]) {
        if (!payloads) {
            payloads = Array.of(...this.payloadTabs);
        }
        const matchedPayload = payloads.find((p) => p.id === tab.id);

        if (matchedPayload) {
            const matchedPayloadIndex = payloads.findIndex(
                (p) => p.id === tab.id
            );

            this.deactivateAllTabs(payloads);

            const _data = {
                ...matchedPayload,
                ...tab,
                fields: [...matchedPayload.fields],
                active: true,
            };
            payloads[matchedPayloadIndex] = _data;
        }

        return payloads;
    }

    handleChangeTab(tab: TabPayload) {
        this.payloadTabs = this.dispatchActiveTabPayload(tab);
        this.activePayloadTab = this.payloadTabs.find((p) => p.active);
        localStorage.setItem(
            'a-tab-payload',
            JSON.stringify(this.activePayloadTab)
        );
    }

    getActiveTab() {
        this.activePayloadTab = this.payloadTabs.find((p) => p.active);
        localStorage.setItem(
            'a-tab-payload',
            JSON.stringify(this.activePayloadTab)
        );
        localStorage.setItem('a-req', this.currentRequestTab.id);
    }

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe((value) => {
            this.currentRequestTab =
                this._mainService.getActiveRequestTab(value);

            const payloads = this.currentRequestTab.payload.data;
            const storeActivePayloadTab = localStorage.getItem('a-tab-payload');
            const sameRequestTab =
                this.currentRequestTab.id === localStorage.getItem('a-req');

            if (!!storeActivePayloadTab) {
                const json: TabPayload = JSON.parse(
                    storeActivePayloadTab || '{}'
                );
                const __payloads = this.dispatchActiveTabPayload(
                    json,
                    payloads
                );
                this.payloadTabs = __payloads;
            } else {
                localStorage.removeItem('a-tab-payload');
                const __payloads = this.dispatchActiveTabPayload(
                    payloads[0],
                    payloads
                );
                this.payloadTabs = __payloads;
            }

            if (!sameRequestTab) {
                if (this.activePayloadTab) this.getActiveTab();
            }
        });

        this.getActiveTab();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    addNewField() {
        const field = { key: '', value: '', description: '', autoFucus: false };
        if (this.activePayloadTab) {
            this.activePayloadTab.fields.push(field);
        }
    }

    deactivateAllTabs(data: TabPayload[]) {
        data.forEach((t) => (t.active = false));
    }

    handleInputFieldInput(event: any, fieldIndex: number) {
        const input = event.target as HTMLInputElement;

        const { value } = input;
        const name = input.name as keyof TabPayloadField;

        if (this.activePayloadTab) {
            const field = this.activePayloadTab.fields[fieldIndex];
            if (field)
                // @ts-ignore
                field[name] = value.trim();
        }
    }

    handleInputFieldChange() {
        const activePayload = this.activePayloadTab;
        const currentData = {
            ...this.currentRequestTab,
            payload: {
                ...this.currentRequestTab.payload,
                data: [...this.currentRequestTab.payload.data],
            },
        } as RequestTab;

        if (activePayload) {
            const activeTabIndex = currentData.payload.data.findIndex(
                (t) => t.id === activePayload.id
            );

            if (activeTabIndex)
                currentData.payload.data[activeTabIndex] = activePayload;
        }

        this._mainService.saveRequestTab(currentData);
    }

    getFieldValues(containerId: string, ContainerWrapper: HTMLDivElement) {
        const element = ContainerWrapper.querySelector(containerId)!;
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
}
