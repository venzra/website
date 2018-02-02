import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListModel } from '../../models/list';
import { Plan } from '../../models/plan';

@Component({
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

    public subscription: Plan;
    public plans: Array<Plan>;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data: { plans: ListModel<Plan> }) => {
            this.plans = data.plans.list;
            this.subscription = this.plans[0];
        });
    }

}
