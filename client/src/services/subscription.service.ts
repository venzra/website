import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Account } from '../models/account';
import { Plan } from '../models/plan';
import { Registration } from '../models/registration';

@Injectable()
export class SubscriptionService {

    private plansUri = 'api/v1/registration/plans';
    private registrationUri = 'api/v1/registration/create';

    constructor(private http: Http) {
        // empty constructor
    }

    getPlans(): Promise<Plan[]> {
        return this.http.get(this.plansUri)
            .toPromise()
            .then((response) => response.json())
            .then((data) => data.list as Plan[]);
    }

    createAccount(accountData: Registration): Promise<Account> {
        return this.http.post(this.registrationUri, accountData)
            .toPromise()
            .then((response) => response.json())
            .then((data) => data as Account);
    }
}
