import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Documentation } from '@venzra/models';

@Component({
    templateUrl: './documentation.component.html'
})
export class DocumentationComponent {

    constructor(
        private dialogRef: MatDialogRef<DocumentationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { documentation: Documentation }
    ) { }

    close(): void {
        this.dialogRef.close();
    }

}
