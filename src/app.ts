import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import router from './router/apiRoutes';
import globalErrorHandler from './middleware/globalErrorHandler';
import responeMessage from './constants/responeMessage';
import httpError from './util/httpError';
//source-map-support
import * as sourceMapSupport from 'source-map-support';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/config';
sourceMapSupport.install();

const app: Application = express();

//middleware
app.use(helmet());
app.use(
    cors({
        origin: [config.SERVER_URL as string],
        credentials: true
    })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

//routes
app.use('/api/v1', router);
//404
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responeMessage.NOT_FOUND('route'));
    } catch (err) {
        httpError(next, err, req, 404);
    }
});
//error handling
app.use(globalErrorHandler);

export default app;
