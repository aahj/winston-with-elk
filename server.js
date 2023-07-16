const app = require('express')();
const cors = require('cors');
const bodyparser = require('body-parser');
const logger = require('./src/logging/log');
const AppRouteController = require('./src/controllers/AppRouteController');
const morganMiddleware = require('./middleware/morgan');
require('dotenv').config();

const PROCESS = process.env;
const { AUTH_PORT } = PROCESS;

app.use(morganMiddleware);

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

process.on('uncaughtException', (err) => {
  logger.error(err);
});

// eslint-disable-next-line no-new
new AppRouteController('v1', app);

global.__basedir = __dirname; //eslint-disable-line

app.listen(AUTH_PORT, () => {
  logger.info(`auth server listening at ${AUTH_PORT} and in ${PROCESS.NODE_ENV}`);
  /* eslint-disable no-console */
  console.log(`auth server listening at ${AUTH_PORT} and in ${PROCESS.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
});
