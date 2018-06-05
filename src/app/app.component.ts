import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '@venzra/environments/environment';

@Component({
    selector: 'venzra-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private ga = (<any>window).ga;

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        this.ga('create', environment.tracking, 'auto');
        this.ga('send', 'pageview');

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);

                this.ga('set', 'page', event.urlAfterRedirects);
                this.ga('send', 'pageview');
            }
        });
    }

}
