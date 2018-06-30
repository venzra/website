import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Account } from '@venzra/models/account';
import { Registration } from '@venzra/models/registration';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(
        private http: HttpClient
    ) { }

    createAccount(accountData: Registration): Observable<Account> {
        return this.http.post<Account>('/website/identity', accountData);
    }
}
