import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSelectModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';

import { VenzraRoutingModule } from './routing.module';

import { PricePipe } from './filters/price.pipe';

import { AppComponent } from './venzra.component';
import { RegistrationComponent, RegistrationDialogComponent } from './components/registration/registration.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FeaturesComponent } from './components/features/features.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { GuidesComponent } from './components/guides/guides.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { SubscriptionService } from './services/subscription.service';
import { PlanListResolve, PlanService } from './services/plan.service';

@NgModule({
    declarations: [
        PricePipe,
        AppComponent,
        RegistrationComponent,
        RegistrationDialogComponent,
        WelcomeComponent,
        FeaturesComponent,
        PricingComponent,
        GuidesComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSnackBarModule,
        MatToolbarModule,
        VenzraRoutingModule
    ],
    entryComponents: [
        RegistrationDialogComponent
    ],
    providers: [
        SubscriptionService,
        PlanService,
        PlanListResolve
    ],
    bootstrap: [AppComponent]
})
export class VenzraModule {
}
