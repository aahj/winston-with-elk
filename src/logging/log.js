/* eslint-disable class-methods-use-this */
const { logTransport } = require('./elastic');

const indexPrefix = 'auth-logging-api';
class Log {
  /**
   * Log info
   * @param {msg} string contain log message
   * @param {data} string contain log data
   */
  info(msg, data) {
    const logger = logTransport(indexPrefix);
    const metaData = { data };
    logger.info(msg, metaData);
  }

  /**
   * Log warning
   * @param {msg} string contain log message
   * @param {data} string contain log data
   */
  warning(msg, data) {
    const logger = logTransport(indexPrefix);
    const metaData = { data };
    logger.warn(msg, metaData);
  }

  /**
   * Log http
   * @param {msg} string contain log message
   * @param {data} string contain log data
   */
  http(msg, data) {
    const logger = logTransport(indexPrefix);
    const metaData = { data };
    logger.http(msg, metaData);
  }

  /**
   * Log child
   * @param {data} Object contain log data
   */
  child(data) {
    const logger = logTransport(indexPrefix);
    // const metaData = { data };
    const child = logger.child(data);
    child.http();
  }

  /**
   * Log error
   * @param {msg} string contain log message
   * @param {data} string contain log data
   */
  error(msg, data) {
    const logger = logTransport(indexPrefix);
    const metaData = { data };
    logger.error(msg, metaData);
  }
}

module.exports = new Log();
