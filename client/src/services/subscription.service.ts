import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Account } from '../models/account';
import { Registration } from '../models/registration';

@Injectable()
export class SubscriptionService {

    constructor(
        private http: HttpClient
    ) { }

    createAccount(accountData: Registration): Observable<Account> {
        return this.http.post<Account>('api/v1/registration/create', accountData);
    }
}
