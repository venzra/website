import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { emailValidator } from '@venzra/models';
import { SupportService } from '@venzra/services';

@Component({
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    public contactForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private supportService: SupportService
    ) { }

    ngOnInit(): void {
        this.contactForm = this.forms.group({
            alias: [undefined, [Validators.required]],
            emailAddress: [undefined, [Validators.required, Validators.pattern(emailValidator)]],
            reason: [undefined, [Validators.required]],
            message: [undefined, [Validators.required]]
        });
    }

    submit(): void {
        const contactData = this.contactForm.getRawValue();

        this.supportService
            .sendMessage(contactData)
            .subscribe(
                () => this.router.navigate(['/contacted']),
                (result) => this.snackbar.open(result.error.message || 'Failed to send message, please try again', 'OK')
            );
    }

}
