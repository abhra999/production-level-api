import config from './config/config';
import app from './app';
import logger from './util/logger';
import databaseService from './service/databaseService';
const server = app.listen(config.PORT);

(async () => {
    try {
        const conn = await databaseService.connect();
        logger.info('MONGO DATABASE_CONNECTED', {
            meta: {
                CONNECTION_NAME: conn.connection.name
            }
        });
        logger.info('APPLICATION_STARTED', {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        });
    } catch (err) {
        logger.error('APPLICATION_ERROR', { meta: err });

        server.close((error) => {
            logger.error('APPLICATION_ERROR', { meta: error });
        });

        process.exit(1);
    }
})();
