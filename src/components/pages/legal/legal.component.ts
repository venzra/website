import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Documentation } from '@venzra/models';
import { SupportService } from '@venzra/services';

@Component({
    templateUrl: './legal.component.html'
})
export class LegalComponent implements OnInit {

    public legal: Documentation;
    private page: String;

    constructor(
        private route: ActivatedRoute,
        private supportService: SupportService
    ) { }

    ngOnInit(): void {
        this.page = this.route.snapshot.params.page;
        this.legal = this.route.snapshot.data.document;

        this.route.params.subscribe((params) => {
            if (this.page === params.page) {
                return false;
            }
            this.page = params.page;
            this.supportService.loadGuide('legal', this.page).subscribe((document) => this.legal = document);
        });
    }

}
