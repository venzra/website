import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Contact, Documentation } from '@venzra/models';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SupportService {

    constructor(
        private http: HttpClient
    ) { }

    loadGuide(section: String, page: String): Observable<Documentation> {
        return this.http.get<Documentation>(`/website/support/guides/${section}/${page}`);
    }

    sendMessage(contact: Contact): Observable<Boolean> {
        return this.http.post<Boolean>('/website/support/contact', contact);
    }
}

@Injectable({
    providedIn: 'root'
})
export class DocumentationResolve implements Resolve<Documentation> {

    constructor(
        private supportService: SupportService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Documentation> {
        return this.supportService.loadGuide(route.params.section || route.data.section, route.params.page);
    }

}
