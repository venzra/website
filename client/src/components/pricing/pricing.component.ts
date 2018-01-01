import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListModel } from '../../services/restful.service';
import { Plan } from '../../services/plan.service';

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
