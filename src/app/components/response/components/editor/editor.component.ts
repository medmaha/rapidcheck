import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from './codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { ResponseService } from '../../../../services/response.service';
import { Subscription } from 'rxjs';
import { MainService } from '../../../../services/main.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild('cmEditor') cmEditor!: CodemirrorComponent;

    theme: 'ayu-dark' | 'eclipse' = 'eclipse';
    language: 'javascript' | 'xml' = 'javascript';
    subscriptions: Subscription[] | undefined;
    @Input() content = '' as string;

    editor: CodeMirror.EditorFromTextArea | null = null;

    constructor(
        private _responseService: ResponseService,
        private _mainService: MainService
    ) {}

    ngOnInit(): void {
        this.subscriptions = [];

        this.subscriptions[0] = this._responseService.data.subscribe(
            (value) => {
                if (typeof value === 'string') {
                    this.content = value;
                    this.language = 'xml';
                } else {
                    this.language = 'javascript';
                    this.content = JSON.stringify(value, null, 2);
                }
                this.updateResponseContent();
            }
        );
    }

    ngOnDestroy(): void {
        this.subscriptions?.forEach((s) => {
            s?.unsubscribe();
        });
    }

    ngAfterViewInit(): void {
        this.updateResponseContent();
        this.subscriptions = this.subscriptions || [];
    }

    updateResponseContent() {
        this.cmEditor?.setEditorContent(this.content, this.language);
    }
}
