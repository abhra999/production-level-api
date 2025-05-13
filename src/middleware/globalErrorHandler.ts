import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/types';

export default (
    err: HttpError,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.statusCode).json(err);
    next();
};
