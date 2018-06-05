import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { MarkdownModule } from '@venzra/directives';
import { ApiInterceptorModule } from '@venzra/services';

import { BannerComponent } from './layout/banner/banner.component';
import { ContentComponent } from './layout/content/content.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ContactedComponent } from './pages/contact/contacted.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { LegalComponent } from './pages/legal/legal.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PrizesComponent } from './pages/prizes/prizes.component';
import { ProductComponent } from './pages/product/product.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisteredComponent } from './pages/register/registered.component';
import { SupportComponent } from './pages/support/support.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

@NgModule({
    declarations: [
        BannerComponent,
        ContentComponent,
        HeaderComponent,
        FooterComponent,
        AboutComponent,
        ContactComponent,
        ContactedComponent,
        DocumentationComponent,
        LegalComponent,
        PricingComponent,
        PrizesComponent,
        ProductComponent,
        RegisterComponent,
        RegisteredComponent,
        SupportComponent,
        WelcomeComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        MarkdownModule,
        ApiInterceptorModule
    ],
    exports: [
        FooterComponent,
        HeaderComponent
    ],
    entryComponents: [
        DocumentationComponent
    ]
})
export class VenzraModule {
}
