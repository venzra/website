import { Component, OnInit } from '@angular/core';

import { SubscriptionService } from './services/subscription.service';
import { Plan } from './models/plan';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    subscriptionPlans: Plan[] = [];

    constructor(
        private subscriptionService: SubscriptionService
    ) {
        // empty constructor
    }

    ngOnInit(): void {
        this.subscriptionService.getPlans().then((plans) => this.subscriptionPlans = plans);
    }
}
