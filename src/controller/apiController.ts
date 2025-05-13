import { NextFunction, Request, Response } from 'express';
import httpResponse from '../util/httpResponse';
import responeMessage from '../constants/responeMessage';
import httpError from '../util/httpError';

export default {
    self: (req: Request, res: Response, next: NextFunction) => {
        try {
            httpResponse(req, res, 200, responeMessage.SUCCESS, { id: 1 });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
};
