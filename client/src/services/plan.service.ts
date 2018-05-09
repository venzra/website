import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { ListModel } from '../models/list';
import { Plan } from '../models/plan';

@Injectable()
export class PlanService {

    constructor(
        private http: HttpClient
    ) { }

    getAllPlans(): Observable<ListModel<Plan>> {
        return this.http.get<ListModel<Plan>>('api/v1/plans');
    }

}

@Injectable()
export class PlanListResolve implements Resolve<ListModel<Plan>> {
    constructor(
        private planService: PlanService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListModel<Plan>> {
        return this.planService.getAllPlans();
    }
}
