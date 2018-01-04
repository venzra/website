import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { GuidesComponent } from './components/guides/guides.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { PlanListResolve } from './services/plan.service';

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'pricing',
        component: PricingComponent,
        resolve: {
            plans: PlanListResolve
        }
    },
    {
        path: 'guides',
        component: GuidesComponent
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '**',
        redirectTo: '/404'
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
