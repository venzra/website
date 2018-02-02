import { Request, Response, NextFunction, Router } from 'express';

import { PlanModel } from '../models/plans';

class SubscriptionController {

    constructor(private router: Router) {
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/plans', this.getPlans.bind(this));
    }

    getPlans(req: Request, res: Response, next: NextFunction) {
        const order = { price: 1, name: 1 };

        PlanModel.count(null).exec()
            .then((total) =>
                PlanModel
                    .aggregate([
                        { $sort: order },
                        { $project: { reference: 1, name: 1, currency: 1, price: 1, interval: 1, frequency: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total }))
            )
            .catch((planError) => next(planError));
    }

}

export { SubscriptionController };
