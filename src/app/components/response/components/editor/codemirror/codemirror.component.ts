import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    ViewChild,
} from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';

@Component({
    selector: 'app-codemirror',
    templateUrl: './codemirror.component.html',
    styleUrls: ['./codemirror.component.css'],
})
export class CodemirrorComponent implements AfterViewInit {
    @ViewChild('textarea') textarea!: ElementRef;
    editor!: CodeMirror.Editor;

    init() {
        this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
            mode: 'xml',
            readOnly: 'nocursor',
            theme: 'eclipse',
            lineNumbers: true,
        });
    }

    ngAfterViewInit(): void {
        this.init();
    }

    setEditorContent(content: string, language: string): void {
        this.editor.setValue(content);
        this.editor.setOption('mode', language);
        this.editor.refresh();
    }

    setEditorTheme(theme: 'ayu-dark' | 'eclipse'): void {
        this.editor.setOption('theme', theme);
        this.editor.refresh();
    }
}
