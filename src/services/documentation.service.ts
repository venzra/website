import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Documentation } from '@venzra/models';

@Injectable({
    providedIn: 'root'
})
export class DocumentationService {

    constructor(
        private http: HttpClient
    ) { }

    findOne(section: String, page: String): Observable<Documentation> {
        return this.http.get<Documentation>(`/documentation/${section}/${page}`);
    }
}

@Injectable({
    providedIn: 'root'
})
export class DocumentationResolve implements Resolve<Documentation> {

    constructor(
        private documentationService: DocumentationService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Documentation> {
        return this.documentationService.findOne(route.params.section || route.data.section, route.params.page);
    }

}
