import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentationResolve } from '@venzra/services';

import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ContactedComponent } from './pages/contact/contacted.component';
import { LegalComponent } from './pages/legal/legal.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ProductComponent } from './pages/product/product.component';
import { PrizesComponent } from './pages/prizes/prizes.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisteredComponent } from './pages/register/registered.component';
import { SupportComponent } from './pages/support/support.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'contacted',
        component: ContactedComponent
    },
    {
        path: 'legal/:page',
        component: LegalComponent,
        data: {
            section: 'legal'
        },
        resolve: {
            document: DocumentationResolve
        }
    },
    {
        path: 'pricing',
        component: PricingComponent
    },
    {
        path: 'prizes',
        component: PrizesComponent
    },
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'registered',
        component: RegisteredComponent
    },
    {
        path: 'support',
        component: SupportComponent
    },
    {
        path: '',
        component: WelcomeComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class VenzraRoutingModule {
}
