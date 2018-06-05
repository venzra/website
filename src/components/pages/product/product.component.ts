import { Component, OnInit } from '@angular/core';

import { Feature } from '@venzra/models/feature';

@Component({
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

    public features: Array<Feature>;
    public technology: Array<Feature>;

    ngOnInit(): void {
        this.features = [
            {
                name: 'Personalisation',
                description: 'Upload your brand logo and choose from many different colour schemes to match.'
            },
            {
                name: 'Product listings',
                description: 'Add or remove products you are selling, personalise then with images and descriptions.'
            },
            {
                name: 'Customer checkout',
                description: 'A simple checkout process linked to our payment gateway speeds up the ordering process.'
            },
            {
                name: 'Order management',
                description: 'See all outstanding and historic orders through a simple to navigate interface.'
            },
            {
                name: 'Analytics and reporting',
                description: 'Quickly see what your customers interests are and how your store is performing.'
            },
            {
                name: 'Security certificates',
                description: 'An SSL certificate is included for free, as you should not need to pay to keep your customers safe.'
            },
            {
                name: 'Content Management',
                description: 'Manage various content pages for your site, such as; About us, Contact us, Terms and Conditions'
            },
            {
                name: 'Locations',
                description: 'Tell customers how to find you or where they can return unwanted goods.'
            },
            {
                name: 'Careers',
                description: 'Looking to grow your business and need more staff, advertise current openings on your store.'
            }
        ];

        this.technology = [
            {
                name: 'Modern',
                description: 'Up to date with modern practices and frameworks, we use Angular, Node, Mongo and Lambda to build the platform.'
            },
            {
                name: 'Scalable',
                description: 'Our platform scales horizontally and runs fast on all devices with content delivery around the globe.'
            },
            {
                name: 'Integrated',
                description: 'Under the hood we have an API, that means we are built for the future and connectivity with providers like Stripe for payments.'
            },
            {
                name: 'Agile',
                description: 'As advocates of Agile development, core principals enable continuous delivery of changes, this means you are always getting every small improvement.'
            },
            {
                name: 'Tested',
                description: 'From day one we have ensured every change to our software is tested automatically, everything from how a password is encrypted to how a user interacts.'
            },
            {
                name: 'User experience',
                description: 'Science and social engineering influences mean we have leveraged the best experience for users and how online interfaces should be.'
            }
        ];
    }

}
