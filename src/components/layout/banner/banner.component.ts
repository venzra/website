import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'venzra-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss']
})
export class BannerComponent {

    constructor(
        private pageTitle: Title
    ) { }

    @Input() align: 'start' | 'center' = 'start';

    @Input() icon: String = '';

    @Input()
    set title(title: String) {
        this.pageTitle.setTitle(`${title} | Venzra`);
    }

}
