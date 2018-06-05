import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { tap } from 'rxjs/operators';

import { environment } from '@venzra/environments/environment';
import { emailValidator } from '@venzra/models';
import { RegistrationService } from '@venzra/services';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public submit = false;
    public registrationForm: FormGroup;

    public adminPortal = environment.adminPortal;

    constructor(
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private registrationService: RegistrationService
    ) { }

    ngOnInit(): void {
        this.registrationForm = this.forms.group({
            identity: [undefined, [Validators.required, Validators.pattern(emailValidator)]],
            acceptTerms: [false, [Validators.requiredTrue]]
        });
    }

    register() {
        const account = this.registrationForm.getRawValue();

        this.registrationService
            .createAccount(account)
            .pipe(tap(() => this.submit = true))
            .subscribe(
                () => this.router.navigate(['/registered']),
                () => {
                    this.submit = false;
                    this.snackbar.open('Registration failed, please try again', 'OK', { duration: 8000 });
                }
            );
    }

}
