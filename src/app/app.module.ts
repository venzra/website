import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { VenzraModule } from '../components/venzra.module';
import { VenzraRoutingModule } from '../components/routing.module';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        BrowserAnimationsModule,
        VenzraModule,
        VenzraRoutingModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
