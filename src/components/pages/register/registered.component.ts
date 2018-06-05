import { Component } from '@angular/core';

import { environment } from '@venzra/environments/environment';

@Component({
    templateUrl: './registered.component.html'
})
export class RegisteredComponent {

    public adminPortal = environment.adminPortal;

}
