import { NextFunction, Request } from 'express';
import errorObject from './errorObject';
import config from '../config/config';
import { ApplicationEnv } from '../constants/application';
import logger from './logger';

export default (
    nextFun: NextFunction,
    err: Error | unknown,
    req: Request,
    errorStatusCode: number = 500
): void => {
    const errorObj = errorObject(err, req, errorStatusCode);
    //log
    logger.error('CONTROLLER_ERROR', { meta: errorObj });

    if (config.ENV === ApplicationEnv.PROUCTION) {
        delete errorObj.request.ip;
        delete errorObj.trace;
    }
    nextFun(errorObj);
};
