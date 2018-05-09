import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ContactService } from '../../services/contact.service';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

interface ReasonModel {
    name: string;
    value: string;
}

@Component({
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    public reasons: Array<ReasonModel>;
    public contactForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private contactService: ContactService,
        private snackbar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.reasons = [
            { name: 'General enquiry', value: 'General enquiry' },
            { name: 'Request support', value: 'Support required' },
            { name: 'Suggest a feature', value: 'Feature suggestion' },
            { name: 'Report a bug', value: 'Defect found' }
        ];

        this.contactForm = this.forms.group({
            alias: [null, [Validators.required]],
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            reason: [null, [Validators.required]],
            message: [null, [Validators.required]]
        });
    }

    contact(): void {
        const contactData = this.contactForm.getRawValue();

        this.contactService
            .sendMessage(contactData)
            .subscribe(
                () => this.contactForm.reset(),
                (result) => this.snackbar.open(result.error.message || 'Failed to send message, please try again', 'OK')
            );
    }

}
