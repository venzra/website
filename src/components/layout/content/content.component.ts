import { Component, Input } from '@angular/core';

@Component({
    selector: 'venzra-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent {

    @Input() background: 'light' | 'normal' = 'normal';

}
