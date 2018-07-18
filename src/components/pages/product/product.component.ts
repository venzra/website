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
                name: 'Product listings',
                image: 'https://cdn.venzra.com/images/marketing/products.jpg',
                description: 'Add or remove products you are selling, and personalise them with images and descriptions.'
            },
            {
                name: 'Customer checkout',
                image: 'https://cdn.venzra.com/images/marketing/checkout.jpg',
                description: 'A simple checkout process linked to our payment gateway speeds up the ordering process.'
            },
            {
                name: 'Order management',
                image: 'https://cdn.venzra.com/images/marketing/order-management.jpg',
                description: 'Fulfil orders through a simple to navigate interface and notify customers on the delivery progress.'
            },
            {
                name: 'Personalisation',
                image: 'https://cdn.venzra.com/images/marketing/personalisation.jpg',
                description: 'Upload your brand logo and choose from many different colour schemes to match.'
            },
            {
                name: 'Analytics and reporting',
                image: 'https://cdn.venzra.com/images/marketing/analytics.jpg',
                description: 'Quickly see what your customers interests are and how your store is performing.'
            },
            {
                name: 'Security',
                image: 'https://cdn.venzra.com/images/marketing/security.jpg',
                description: 'An SSL certificate is included for free, and the platform is PCI-DSS compliant to ensure data protection.'
            },
            {
                name: 'Content Management',
                image: 'https://cdn.venzra.com/images/marketing/content.jpg',
                description: 'Manage various content pages for your site, such as; About us, Contact us, Terms and Conditions'
            },
            {
                name: 'Locations',
                image: 'https://cdn.venzra.com/images/marketing/locations.jpg',
                description: 'Tell customers how to find you and inform them of the type of business they can engage with you there.'
            },
            {
                name: 'Careers',
                image: 'https://cdn.venzra.com/images/marketing/careers.jpg',
                description: 'Looking to grow your business and need more staff, advertise current openings on your store.'
            }
        ];

        this.technology = [
            {
                name: 'Modern',
                image: 'https://cdn.venzra.com/images/marketing/modern.jpg',
                description: 'Up to date with modern practices and frameworks, we use Angular, Node, Mongo and Lambda to build the platform.'
            },
            {
                name: 'Scalable',
                image: 'https://cdn.venzra.com/images/marketing/scalable.jpg',
                description: 'Our platform scales horizontally and runs fast on all devices with content delivery around the globe.'
            },
            {
                name: 'User experience',
                image: 'https://cdn.venzra.com/images/marketing/user-experience.jpg',
                description: 'Science and social engineering influences mean we have leveraged the best experience for users and how online interfaces should be.'
            },
            {
                name: 'Agile',
                image: 'https://cdn.venzra.com/images/marketing/agile.jpg',
                description: 'As advocates of Agile development, core principals enable continuous delivery of changes, this means you are always getting every small improvement.'
            },
            {
                name: 'Tested',
                image: 'https://cdn.venzra.com/images/marketing/tested.jpg',
                description: 'From day one we have ensured every change to our software is tested automatically, everything from how a password is encrypted to how a user interacts.'
            },
            {
                name: 'Integrated',
                image: 'https://cdn.venzra.com/images/marketing/integrated.jpg',
                description: 'Under the hood we have an API, that means we are built for the future and connectivity with providers like Stripe for payments.'
            }
        ];
    }

}
