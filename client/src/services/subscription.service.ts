import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Account } from '../models/account';
import { Registration } from '../models/registration';

@Injectable()
export class SubscriptionService {

    constructor(
        private http: HttpClient
    ) { }

    createAccount(accountData: Registration): Promise<Account> {
        return this.http.post('api/v1/registration/create', accountData)
            .toPromise()
            .then((response) => response as Account);
    }
}
