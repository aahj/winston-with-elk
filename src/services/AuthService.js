const logger = require('../logging/log');
const ErrorHandler = require('../utils/ErrorHandler');

class AuthService {
  constructor() {
    this.login = this.login.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async login(req) {
    try {
      const { body } = req;
      const user = new Map();
      user.set('email', 'test@gmail.com');
      user.set('pass', '1234567890');
      if (!body.email || !body.password) {
        return ErrorHandler(400, 'Please enter Email or Password');
      }

      if (!(user.get('email') === body.email)) {
        return ErrorHandler(404, 'Invalid Email', false, { email: body.email });
      }

      if (!(user.get('pass') === body.password)) {
        return ErrorHandler(404, 'Invalid Email or Password', false, { email: body.email });
      }

      logger.info(`${body.email} login success!`);
      return {
        success: true,
        message: 'login success!',
        data: { user },

        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: 500,
      };
    }
  }
}

module.exports = AuthService;
