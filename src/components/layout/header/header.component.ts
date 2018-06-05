import { Component } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'venzra-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public adminPortal = environment.adminPortal;

}
