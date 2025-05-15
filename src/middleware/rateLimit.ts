import { NextFunction, Request, Response } from 'express';
import { rateLimiterMongo } from '../config/rate-limiter';
import httpError from '../util/httpError';
import responeMessage from '../constants/responeMessage';
import config from '../config/config';
import { ApplicationEnv } from '../constants/application';

export default (req: Request, _: Response, next: NextFunction) => {
    if (config.ENV === ApplicationEnv.DEVELOPMENT) {
        return next();
    }
    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip as string, 1)
            .then(() => {
                next();
            })
            .catch(() => {
                httpError(
                    next,
                    new Error(responeMessage.TO_MANY_REQUEST),
                    req,
                    429
                );
            });
    }
};
