import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-codemirror',
    templateUrl: './codemirror.component.html',
    styleUrls: ['./codemirror.component.css'],
})
export class CodemirrorComponent implements AfterViewInit {
    @ViewChild('textarea') textarea!: ElementRef;
    editor!: CodeMirror.Editor;
    subscription: Subscription | undefined;

    init() {
        this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
            mode: 'javascript',
            readOnly: 'nocursor',
            theme: 'ayu-dark',
            lineNumbers: true,
            lineWrapping: true,
            smartIndent: true,
            lineNumberFormatter(line) {
                return line.toString();
            },
        });
    }

    ngAfterViewInit(): void {
        this.init();
    }

    setEditorContent(content: string, language: string): void {
        this.editor.setValue(content);
        this.editor.setOption('mode', language);
        this.editor.setOption('lineNumbers', true);
        this.editor.refresh();
    }
}
