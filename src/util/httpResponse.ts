import { Request, Response } from 'express';
import { HttpReponse } from '../types/types';
import { ApplicationEnv } from '../constants/application';
import config from '../config/config';
import logger from './logger';

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null
): void => {
    const response: HttpReponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.url
        },
        message: responseMessage,
        data: data
    };

    //log
    logger.info('CONTROLLER_RESPONSE', { meta: response });

    if (config.ENV === ApplicationEnv.PROUCTION) {
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
};
