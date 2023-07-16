const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
require('dotenv').config();
require('winston-daily-rotate-file');
const uuid = require('uuid');
const packagejson = require('../../package.json');

const { combine, timestamp, errors, json } = format;
const DIRNAME = __dirname;
const ENV = process.env;
const levels = {
  error: 0,
  warn: 1,
  http: 2,
  info: 3,
  debug: 4,
};

const elasticTransport = (spanTracerId, indexPrefix) => {
  const esTransportOpts = {
    level: 'info',
    indexPrefix,
    indexSuffixPattern: 'YYYY-MM-DD',
    transformer: (logData) => {
      const spanId = spanTracerId;
      return {
        '@timestamp': new Date().getTime(),
        severity: logData.level,
        stack: logData.meta.stack,
        service_name: packagejson.name,
        service_version: packagejson.version,
        message: `${logData.message}`,
        data: JSON.stringify(logData.meta.data),
        span_id: spanId,
        user_id: logData.meta.userId,
        method: logData.meta.method,
        url: logData.meta.url,
        status: logData.meta.status,
        'response-time': logData.meta['response-time'],
        userAgent: logData.meta.userAgent,
      };
    },
    clientOpts: {
      node: ENV.ELASTIC_HOST,
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: false,
      auth: {
        username: ENV.ELASTIC_USER,
        password: ENV.ELASTIC_PASSWORD,
      },
    },
  };
  return esTransportOpts;
};

module.exports.logTransport = (indexPrefix) => {
  const spanTracerId = uuid.v1();
  const transport = new transports.DailyRotateFile({
    filename: `${DIRNAME}/../../logs/auth-output-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxFiles: '5d',
    maxSize: '20m',
    frequency: '3h',
  });
  const logger = createLogger({
    level: 'info',
    levels,
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [transport, new ElasticsearchTransport({ ...elasticTransport(spanTracerId, indexPrefix) })],
    handleExceptions: true,
  });
  if (ENV.NODE_ENV === 'localhost') {
    logger.add(new transports.Console({ format: format.splat(), level: 'debug' }));
  }
  return logger;
};
