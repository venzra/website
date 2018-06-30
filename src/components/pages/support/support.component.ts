import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { SupportService } from '@venzra/services';
import { DocumentationComponent } from '../documentation/documentation.component';

@Component({
    templateUrl: './support.component.html'
})
export class SupportComponent {

    constructor(
        private supportService: SupportService,
        private dialog: MatDialog
    ) { }

    openDocs(section: String, page: String): void {
        this.supportService
            .loadGuide(section, page)
            .subscribe((documentation) => this.dialog.open(DocumentationComponent, { data: { documentation } }));
    }

}
