import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Registration } from '../../models/registration';

import { SubscriptionService } from '../../services/subscription.service';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    selector: 'registration-dialog',
    templateUrl: './registration.dialog.html'
})
export class RegistrationDialog {
    constructor(private dialogRef: MatDialogRef<RegistrationDialog>) {
        // empty constructor
    }

    confirm(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'registration-form',
    templateUrl: './registration.component.html'
})
export class RegistrationComponent {

    account: Registration;
    accountForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService
    ) {
        this.createForm();
    }

    createForm(): void {
        this.accountForm = this.forms.group({
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]]
        });
    }

    register(): void {
        this.saving = true;

        const accountData = this.accountForm.value;

        this.account = {
            identity: accountData.emailAddress as string
        };

        this.subscriptionService
            .createAccount(this.account)
            .then(() => this.dialog.open(RegistrationDialog))
            .catch(() => this.snackbar.open('Registration failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
