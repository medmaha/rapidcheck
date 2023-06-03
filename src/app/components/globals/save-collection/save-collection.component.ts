import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Collection } from '../../../models';

@Component({
    selector: 'app-save-collection',
    templateUrl: './save-collection.component.html',
    styleUrls: ['./save-collection.component.css'],
})
export class SaveCollectionComponent {
    @Input() collection = {} as Collection;
    @Output() closeCollectionSave = new EventEmitter();
    @Output() save = new EventEmitter<{ name: string; colId: string }>();
    action: 'create' | 'edit' = 'edit';

    isValidInput = false;

    handleFormChange(ev: Event) {
        const form = ev.currentTarget as HTMLFormElement;
        this.isValidInput = form.checkValidity();
    }
    handleFormSubmit(ev: Event) {
        ev.preventDefault();

        const elm = ev.currentTarget as HTMLFormElement;

        if (elm.checkValidity()) {
            const form = new FormData(elm);
            const name = form.get('r-collection')?.valueOf() as string;

            this._save(name);
        }
    }

    closeSave() {
        this.closeCollectionSave.emit();
    }

    private _save(name: string) {
        this.save.emit({ name, colId: this.collection?.id });
    }
}
