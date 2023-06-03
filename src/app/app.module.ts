import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeadersComponent } from './components/request/headers/headers.component';
import { TabComponent } from './components/request/headers/components/tab/tab.component';
import { TabTitleComponent } from './components/request/headers/components/tab-title/tab-title.component';
import { SaveModalComponent } from './components/request/headers/components/save-modal/save-modal.component';
import { RequestComponent } from './components/request/request.component';
import { RequestPayloadComponent } from './components/request/components/request-payload/request-payload.component';

// * Services
import { RequestService } from './services/request.service';
import { CookiesService } from './services/cookie.service';
import { MainService } from './services/main.service';

import { CollectionsComponent } from './components/left-panel/collections/collections.component';
import { ColRequestComponent } from './components/left-panel/collections/components/col-request/col-request.component';
import { ColRequestTabComponent } from './components/left-panel/collections/components/col-request-tab/col-request-tab.component';
import { HistoryComponent } from './components/left-panel/history/history.component';
import { SaveCollectionComponent } from './components/globals/save-collection/save-collection.component';
import { SaveRequestComponent } from './components/globals/save-request/save-request.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { CodemirrorComponent } from './components/response/components/editor/codemirror/codemirror.component';
import { EditorComponent } from './components/response/components/editor/editor.component';
import { ResponseComponent } from './components/response/response.component';
import { HeadingsComponent } from './components/response/components/headings/headings.component';

@NgModule({
    declarations: [
        AppComponent,
        HeadersComponent,
        TabComponent,
        TabTitleComponent,
        RequestComponent,
        RequestPayloadComponent,
        SaveModalComponent,
        CollectionsComponent,
        ColRequestComponent,
        ColRequestTabComponent,
        HistoryComponent,
        SaveCollectionComponent,
        SaveRequestComponent,
        LeftPanelComponent,
        CodemirrorComponent,
        EditorComponent,
        ResponseComponent,
        HeadingsComponent,
    ],
    imports: [BrowserModule, HttpClientModule, FormsModule],
    providers: [MainService, CookiesService, RequestService],
    bootstrap: [AppComponent],
})
export class AppModule {}
