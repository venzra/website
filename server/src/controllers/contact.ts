import { Request, Response, NextFunction, Router } from 'express';

import { mailer, email } from '../services/mailer';
import * as config from '../config';

class ContactController {

    constructor(private router: Router) {
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/contact', this.send.bind(this));
    }

    send(req: Request, res: Response, next: NextFunction) {

        const alias = req.body.alias;
        const emailAddress = req.body.emailAddress;
        const subject = req.body.reason;
        const message = req.body.message;

        mailer
            .send(
                subject,
                config.environment.contactEmail,
                email.contact({ subject, alias, emailAddress, message })
            )
            .then(() => res.status(200).send({ result: 'ok' }))
            .catch((error) => next(error));
    }

}

export { ContactController };
