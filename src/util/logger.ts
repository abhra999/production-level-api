import winston from 'winston';
import { green, yellow, red, cyan, magenta, bold } from 'colorette';
import path from 'path';
import config from '../config/config';
import 'winston-mongodb';
const { combine, timestamp, printf } = winston.format;

// Colorette-enhanced console formatter
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
    let coloredMessage = message;
    let levelTag = level.toUpperCase();

    switch (level) {
        case 'error':
            coloredMessage = red(message as string);
            levelTag = red(bold(levelTag));
            break;
        case 'warn':
            coloredMessage = yellow(message as string);
            levelTag = yellow(bold(levelTag));
            break;
        case 'info':
            coloredMessage = green(message as string);
            levelTag = green(bold(levelTag));
            break;
        case 'debug':
            coloredMessage = cyan(message as string);
            levelTag = cyan(bold(levelTag));
            break;
        default:
            coloredMessage = magenta(message as string);
            levelTag = magenta(bold(levelTag));
    }

    return `[${timestamp}] ${levelTag}: ${coloredMessage} meta: ${magenta(Object.keys(meta).length ? JSON.stringify(meta) : '')})`;
});

// Clean file format
const fileFormat = printf(({ level, message, timestamp, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} meta: ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
    defaultMeta: {
        meta: {}
    },
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), fileFormat),
    transports:
        config.ENV === 'development'
            ? [
                  // File logging (clean format)
                  new winston.transports.File({
                      filename: path.join(
                          __dirname,
                          '../',
                          'logs',
                          'combined-log.log'
                      ),
                      level: 'info'
                  }),
                  new winston.transports.File({
                      filename: path.join(
                          __dirname,
                          '../',
                          'logs',
                          'error-log.log'
                      ),
                      level: 'error'
                  }),
                  // Console logging (colorized format)
                  new winston.transports.Console({
                      format: combine(
                          timestamp({ format: 'HH:mm:ss' }),
                          consoleFormat
                      )
                  }),
                  // MongoDB transport
                  new winston.transports.MongoDB({
                      level: 'info',
                      db: config.DATABASE_URL as string,
                      metaKey: 'meta',
                      expireAfterSeconds: 3600 * 24 * 30,
                      collection: 'application-log'
                  })
              ]
            : [
                  // MongoDB transport
                  new winston.transports.MongoDB({
                      level: 'info',
                      db: config.DATABASE_URL as string,
                      metaKey: 'meta',
                      expireAfterSeconds: 3600 * 24 * 30,
                      collection: 'application-log'
                  })
              ]
});

export default logger;
