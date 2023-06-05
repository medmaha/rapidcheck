import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import { Subscription } from 'rxjs';
import { MainService } from '../../../../../services/main.service';

@Component({
    selector: 'app-codemirror',
    templateUrl: './codemirror.component.html',
    styleUrls: ['./codemirror.component.css'],
})
export class CodemirrorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('textarea') textarea!: ElementRef;
    editor!: CodeMirror.Editor;
    subscription: Subscription | undefined;

    constructor(private _mainService: MainService) {}

    init() {
        this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, {
            mode: 'xml',
            readOnly: 'nocursor',
            theme: 'eclipse',
            lineNumbers: true,
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.init();
        this.subscription = this._mainService.theme.subscribe((t) => {
            console.log(t);
            switch (t) {
                case 'light':
                    this.setEditorTheme('eclipse');
                    break;
                case 'dark':
                    this.setEditorTheme('ayu-dark');
                    break;
                default:
                    break;
            }
        });
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
