import { Request, Response, NextFunction } from 'express';

import * as winston from 'winston';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: () => Date.now(),
                formatter: (options) => `${req.ip} - ERROR LOG - [${new Date(options.timestamp()).toISOString()}] - "${req.method} ${req.originalUrl}" ${options.level.toUpperCase()} "${options.message}"`
            })
        ]
    });
    logger.info(err.message);

    res.status(400);
    res.send({ error: 'Bad Request' });
};
