import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    templateUrl: './confirmation.dialog.html',
    styleUrls: ['./confirmation.dialog.scss']
})
export class RegistrationConfirmationDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<RegistrationConfirmationDialogComponent>
    ) { }

    confirm(): void {
        this.dialogRef.close();
    }
}
