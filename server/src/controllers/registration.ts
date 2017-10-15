import { createHash } from 'crypto';
import { v4 } from 'uuid';

import { Request, Response, NextFunction, Router } from 'express';

import * as config from '../config';
import { mailer, email } from '../services/mailer';
import { IAccountModel, AccountModel } from '../models/account';

class RegistrationController {

    constructor(private router: Router) {
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/registration/create', this.create.bind(this), this.findAccount.bind(this));
        this.router.get('/registration/plans', this.plans.bind(this));
    }

    create(req: Request, res: Response, next: NextFunction) {
        const subject = 'Registration confirmation';
        const marketingUrl = config.environment.marketingPortal;
        const managementUrl = config.environment.managementPortal;

        const identity = (req.body.identity || '').toLowerCase();

        AccountModel.findOne({ identity })
            .then((account: IAccountModel) => {
                const date = new Date();

                let expiry = 7;

                if (!account) {
                    account = new AccountModel({ identity });
                } else {
                    expiry = 2;
                    account.status = 'RECOVERY';
                }

                account.validation = {
                    key: createHash('sha256').update(v4()).digest('hex').substr(0, 16),
                    expires: new Date(date.setDate(date.getDate() + expiry))
                };

                return account.save();
            })
            .then((account: IAccountModel) => mailer
                .send(
                    subject,
                    account.get('identity'),
                    email.activation({ subject, marketingUrl, managementUrl, account })
                )
                .then(() => account)
            )
            .then((account: IAccountModel) => {
                req.params.accountId = account._id;
                next();
            })
            .catch((err) => next(err));
    }

    plans(req: Request, res: Response) {
        const plans = [
            { name: 'United Kingdom', currency: 'GBP', symbol: '£', units: 'p', quantity: 10, value: 80, fraction: 100, fee: 25 },
            { name: 'United States of America', currency: 'USD', symbol: '$', units: '¢', quantity: 10, value: 100, fraction: 100, fee: 30 }
        ];

        res.send({ list: plans });
    }

    findAccount(req: Request, res: Response, next: NextFunction) {
        AccountModel.findById(req.params.accountId)
            .select('_id identity status created updated')
            .then((account) => res.send(account))
            .catch((err) => next(err));
    }

}

export { RegistrationController };
