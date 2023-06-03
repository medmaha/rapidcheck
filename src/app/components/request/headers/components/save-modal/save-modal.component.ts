import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CollectionArray, RequestTab } from '../../../../../models';
import { MainService } from '../../../../../services/main.service';

@Component({
    selector: 'app-save-modal',
    templateUrl: './save-modal.component.html',
    styleUrls: ['./save-modal.component.css'],
})
export class SaveModalComponent implements OnInit, OnDestroy {
    @Output() closeSave = new EventEmitter();

    collection = [] as CollectionArray;
    tab = {} as RequestTab;
    addDesc = false;
    isInvalid = true;
    subscription: Subscription | undefined;

    constructor(private _mainService: MainService) {}

    ngOnInit(): void {
        this.subscription = this._mainService.collections.subscribe(
            (col) => (this.collection = col)
        );
        // this.collection = this._mainService.collections.value;
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    toggleDescription() {
        this.addDesc = !this.addDesc;
    }
    handleFormChange(event: Event) {
        const form = event.currentTarget as HTMLFormElement;
        this.isInvalid = form.checkValidity() ? false : true;
    }
    handleFormSubmit(event: Event) {
        event.preventDefault();

        const element = event.currentTarget as HTMLFormElement;
        const form = new FormData(element);

        const data = {} as RequestTab;

        data.name = form.get('r-name') as string;
        data.description = form.get('r-desc')?.valueOf() as string;

        this._mainService.saveRequestTab(data);
        this.closeModal();
    }

    getPageDate() {}

    closeModal() {
        this.closeSave.emit();
    }
}
