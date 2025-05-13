import { Request } from 'express';
import { HttpError } from '../types/types';
import responeMessage from '../constants/responeMessage';

export default (
    err: Error | unknown,
    req: Request,
    errorStatusCode: number = 500
): HttpError => {
    const errorObj: HttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip,
            method: req.method,
            url: req.url
        },
        message: responeMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    };

    return errorObj;
};
