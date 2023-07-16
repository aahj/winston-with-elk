const fs = require("fs");
const path = require("path");
const dirname = __dirname; // eslint-disable-line no-undef

class AppRouteController {
  constructor(apiVersion, app) {
    fs.readdirSync(path.join(dirname, apiVersion)).forEach((file) => {
        const route = `${file.split('.')[0]}`;
        app.use(`/api/${apiVersion}/${route}`, require(`./${apiVersion}/${route}`));
    });
  }
}

module.exports = AppRouteController;
