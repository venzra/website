import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../environments/environment';

@Component({
    selector: 'venzra-root',
    templateUrl: './venzra.component.html',
    styleUrls: ['./venzra.component.scss']
})
export class AppComponent implements OnInit {

    private ga = (<any>window).ga;

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        this.ga('create', environment.tracking, 'auto');
        this.ga('send', 'pageview');

        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);

                this.ga('set', 'page', event.urlAfterRedirects);
                this.ga('send', 'pageview');
            }
        });
    }

}
