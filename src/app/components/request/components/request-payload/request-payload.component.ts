import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestTab } from '../../../../models';
import { MainService } from '../../../../services/main.service';

let _activeTab = {} as Tab;

@Component({
    selector: 'app-request-payload',
    templateUrl: './request-payload.component.html',
    styleUrls: ['./request-payload.component.css'],
})
export class RequestPayloadComponent implements OnInit, OnDestroy {
    tabs = initTabs();

    activeTab = (_activeTab.title && _activeTab) || this.tabs[0];

    currentRequestTab = {} as RequestTab;
    subscription: Subscription | undefined;

    constructor(private _mainService: MainService) {}

    handleChangeTab(tab: Tab) {
        this.activeTab = tab;
        _activeTab = tab;
        this.switchActiveTab();
    }

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe((value) => {
            this.currentRequestTab = this._mainService.getActiveRequestTab();

            const { queryParams, queryString, headers, data } =
                this.currentRequestTab.payload;

            function abstractData(_tab: Tab, data: { [key: string]: string }) {
                Object.entries(data).forEach((entry, i) => {
                    const [key, value] = entry;
                    if (_tab.fields[i]) {
                        _tab.fields[i] = { key, value };
                    } else _tab.fields.push({ key, value });
                });
            }

            this.tabs = initTabs().filter((_tab) => {
                sw: switch (_tab.name) {
                    case 'Params':
                        abstractData(_tab, queryParams);
                        break sw;
                    case 'Query':
                        abstractData(_tab, queryString);
                        break sw;
                    case 'Body':
                        if (data) abstractData(_tab, data);
                        break sw;
                    case 'Headers':
                        abstractData(_tab, headers);
                        break sw;
                    default:
                        break sw;
                }

                return _tab;
            });
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.tabs = initTabs();
    }

    addNewField() {
        this.activeTab.fields.push(newFields());
    }

    switchActiveTab() {
        const activeTab = this.tabs.find((_tab) => _tab.active);

        console.log(activeTab);

        if (activeTab) {
            activeTab.active = false;
        }
        this.activeTab.active = true;
    }

    ngModelChange(
        tabId: string,
        idx: number,
        isKey: boolean | null,
        event: Event
    ) {
        const value = (event.target as HTMLInputElement).value;
        const tab = this.tabs.find((tab) => tab.id === tabId)!;
        if (isKey === null) {
            tab.fields[idx].description = value;
        } else if (isKey) {
            tab.fields[idx]['key'] = value;
        } else tab.fields[idx]['value'] = value;
    }
}

function newFields(active = false): Field {
    return {};
}

type Field = { key?: string; value?: string; description?: string };

type Tab = {
    name: string;
    title: string;
    editorId: string;
    active: boolean;
    fields: Field[];
    id: string;
};

function initTabs() {
    const f = () => ({ key: '', value: '', description: '' });
    return [
        {
            name: 'Params',
            title: 'Query Params',
            editorId: 'queryTab',
            active: true,
            id: 'r-params',
            fields: [f(), f()],
        },
        {
            name: 'Headers',
            title: 'Request Headers',
            editorId: 'headerTab',
            active: false,
            id: 'r-headers',
            fields: [f(), f()],
        },
        {
            name: 'Body',
            title: 'Headers Body',
            editorId: 'bodyTab',
            active: false,
            id: 'r-body',
            fields: [f(), f()],
        },
        {
            name: 'Query',
            title: 'Query String',
            editorId: 'bodyTab',
            active: false,
            id: 'r-query',
            fields: [f(), f()],
        },
    ] as Tab[];
}
