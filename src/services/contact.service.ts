import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Contact } from '@venzra/models';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    constructor(
        private http: HttpClient
    ) { }

    sendMessage(contact: Contact): Observable<Boolean> {
        return this.http.post<Boolean>('/support/contact', contact);
    }
}
