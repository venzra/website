import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { RegistrationComponent, RegistrationDialog } from './components/registration/registration.component';
import { SubscriptionService } from './services/subscription.service';

@NgModule({
    declarations: [
        AppComponent,
        RegistrationComponent,
        RegistrationDialog
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSnackBarModule
    ],
    entryComponents: [
        RegistrationDialog
    ],
    providers: [SubscriptionService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
