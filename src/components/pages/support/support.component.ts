import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DocumentationService } from '@venzra/services/documentation.service';
import { DocumentationComponent } from '../documentation/documentation.component';

@Component({
    templateUrl: './support.component.html'
})
export class SupportComponent {

    constructor(
        private documentationService: DocumentationService,
        private dialog: MatDialog
    ) { }

    openDocs(section: String, page: String): void {
        this.documentationService
            .findOne(section, page)
            .subscribe((documentation) => this.dialog.open(DocumentationComponent, { data: { documentation } }));
    }

}
