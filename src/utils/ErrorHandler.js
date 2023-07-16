const logger = require('../logging/log');

function ErrorHandler(statusCode, message, success = false, ...rest) {
  const [option] = rest;
  if (arguments.length > 3) {
    // logger.error(`${message} -> ${rest}`);
    logger.error(message, option);
  } else {
    logger.error(message);
  }
  return {
    success,
    message,
    status: statusCode,
  };
}

module.exports = ErrorHandler;
