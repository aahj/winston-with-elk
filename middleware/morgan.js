const morgan = require('morgan');
const Mystream = require('./stream');

const writer = new Mystream();

morgan.token('userId', (req) => {
  if (req.decoded) {
    return req.decoded.id.toString();
  }
  return '-';
});

const morganMiddleware = morgan(
  'userId: :userId, method: :method, url: :url, status: :status, response-time: :response-time ms, userAgent: :user-agent',
  { stream: writer }
);
module.exports = morganMiddleware;
