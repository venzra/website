import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Contact } from '../models/contact';

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient
    ) { }

    sendMessage(contactData: Contact): Observable<boolean> {
        return this.http.post<boolean>('api/v1/contact', contactData);
    }
}
