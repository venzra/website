import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Contact } from '../models/contact';

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient
    ) { }

    sendMessage(contactData: Contact): Promise<boolean> {
        return this.http.post('api/v1/contact', contactData)
            .toPromise()
            .then(() => true);
    }
}
