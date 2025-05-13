import path from 'path';
import winston from 'winston';
import config from '../config/config';
import { FileTransportInstance } from 'winston/lib/winston/transports';
const { combine, align, printf, timestamp, json } = winston.format;

const errorFilter = winston.format((info) => {
    return info.level === 'error' ? info : false;
});

const transportArray: FileTransportInstance[] =
    config.ENV === 'development'
        ? [
              new winston.transports.File({
                  filename: path.join(__dirname, '../', 'logs', 'combined.log')
              }),
              new winston.transports.File({
                  filename: path.join(
                      __dirname,
                      '../',
                      'logs',
                      'app-error.log'
                  ),
                  level: 'error',
                  format: combine(
                      errorFilter(),
                      timestamp({
                          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
                      }),
                      align(),
                      printf(
                          (info) =>
                              `[${info.timestamp}] ${info.level}: ${info.message} : meta: ${info.data}`
                      )
                  )
              })
          ]
        : [];

const logger = winston.createLogger({
    format: combine(timestamp(), json()),
    defaultMeta: {
        meta: {}
    },
    transports: transportArray
});

export default logger;
