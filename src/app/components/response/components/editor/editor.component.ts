import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from './codemirror/codemirror.component';
import * as CodeMirror from 'codemirror';
import { ResponseService } from '../../../../services/response.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
    @ViewChild('cmEditor') cmEditor!: CodemirrorComponent;

    theme: 'ayu-dark' | 'eclipse' = 'eclipse';
    language: 'javascript' | 'xml' = 'javascript';

    @Input() content = '' as string;

    editor: CodeMirror.EditorFromTextArea | null = null;

    constructor(private _responseService: ResponseService) {}

    ngOnInit(): void {
        console.log(document.body.classList.contains('.dark'));
        if (document.body.classList.contains('dark')) {
            this.theme = 'ayu-dark';
        } else {
            this.theme = 'eclipse';
        }

        this._responseService.data.subscribe((value) => {
            if (typeof value === 'string') {
                this.content = value;
                this.language = 'xml';
            } else {
                this.language = 'javascript';
                this.content = JSON.stringify(value, null, 2);
            }
            this.updateResponseContent();
        });
    }

    ngAfterViewInit(): void {
        this.cmEditor.setEditorTheme(this.theme);
        this.updateResponseContent();
    }

    updateResponseContent() {
        this.cmEditor?.setEditorContent(this.content, this.language);
    }
}
